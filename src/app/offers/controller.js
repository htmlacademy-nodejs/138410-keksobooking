'use strict';

const Ajv = require(`ajv`);
const toStream = require(`buffer-to-stream`);

const BadRequestError = require(`../errors/bad-request`);
const NotFoundError = require(`../errors/not-found`);

const schema = require(`./schema`);

const utils = require(`../../helpers/utils`);
const {NameData} = require(`../../helpers/data`);

const SKIP_DEFAULT = 0;
const LIMIT_DEFAULT = 20;

const ajv = new Ajv({allErrors: true, coerceTypes: true});
const validate = ajv.compile(schema);

const getLocationFromAddress = (address) => {
  const [x, y] = address.replace(` `, ``).split(`,`);

  return {
    x: parseInt(x, 10),
    y: parseInt(y, 10)
  };
};

class OffersController {
  constructor(store, imagesStore) {
    this.store = store;
    this.imagesStore = imagesStore;
  }

  getOffers() {
    return async (req, res) => {
      const skip = parseInt(req.query.skip, 10) || SKIP_DEFAULT;
      const limit = parseInt(req.query.limit, 10) || LIMIT_DEFAULT;

      const cursor = await this.store.getOffers();
      const offers = await cursor.skip(skip).limit(limit).toArray();

      res.send(offers);
    };
  }

  getOfferByDate() {
    return async (req, res) => {
      const date = parseInt(req.params.date, 10);
      const offer = await this.store.getOffer(date);

      if (!offer) {
        throw new NotFoundError(`An offer with date: ${date} not found`);
      }

      res.send(offer);
    };
  }

  postOffer() {
    return async (req, res) => {
      const body = Object.assign({}, req.body);
      const valid = validate(body);

      if (!valid) {
        const message = validate.errors.map((err) => `${err.schemaPath}: ${err.message}`).join(`. `);
        throw new BadRequestError(message);
      }

      const files = req.files;
      const avatar = files && files.avatar ? files.avatar[0].originalname : body.avatar;
      const preview = files && files.preview ? files.preview[0].originalname : body.preview;
      const name = body.name ? body.name : utils.getRandomFromArray(NameData);

      delete body.name;
      delete body.avatar;
      delete body.preview;

      const offer = {
        author: {
          name,
          avatar,
          preview,
        },
        offer: body,
        location: getLocationFromAddress(body.address),
        date: (new Date()).getTime()
      };

      const result = await this.store.saveData(offer);
      if (files && files.avatar) {
        await this.imagesStore.save(result.insertedId, toStream(files.avatar[0].buffer));
      }

      res.send(offer);
    };
  }

  getAvatar() {
    return async (req, res) => {
      const date = parseInt(req.params.date, 10);
      const offer = await this.store.getOffer(date);

      if (!offer) {
        throw new NotFoundError(`An offer with date: ${date} not found`);
      }

      const result = await this.imagesStore.get(offer._id);
      if (!result) {
        throw new NotFoundError(`An offer avatar with date: ${date} not found`);
      }

      res.header(`Content-Type`, `image/jpg`);
      res.header(`Content-Length`, result.info.length);

      res.on(`error`, (e) => console.error(e));
      res.on(`end`, () => res.end());

      const stream = result.stream;
      stream.on(`error`, (e) => console.error(e));
      stream.on(`end`, () => res.end());
      stream.pipe(res);
    };
  }
}

module.exports = OffersController;
