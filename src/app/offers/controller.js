'use strict';

const Ajv = require(`ajv`);
const toStream = require(`buffer-to-stream`);

const logger = require(`../../logger`);

const BadRequestError = require(`../errors/bad-request`);
const NotFoundError = require(`../errors/not-found`);

const schema = require(`./schema`);

const utils = require(`../../helpers/utils`);
const {NameData} = require(`../../helpers/data`);

const SKIP_DEFAULT = 0;
const LIMIT_DEFAULT = 20;

const getterImage = Symbol(`image`);
const saveImage = Symbol(`save`);
const check = Symbol(`check`);
const saveImages = Symbol(`save-images`);

const ajv = new Ajv({allErrors: true, coerceTypes: true});
const validate = ajv.compile(schema);

const getLocationFromAddress = (address) => {
  const [x, y] = address.replace(` `, ``).split(`,`);

  return {
    x: parseInt(x, 10),
    y: parseInt(y, 10)
  };
};

const prepareData = ({body, files}) => {
  const data = Object.assign({}, body);
  data.avatar = files && files.avatar ? files.avatar[0].originalname : data.avatar;
  data.photos = files && files.preview ?
    files.preview.map((p) => p.originalname) :
    body.preview;

  delete data.preview;

  return data;
};

const enrichData = (data, files) => {
  const offer = Object.assign({}, data);
  const date = (new Date()).getTime();
  const name = offer.name ? offer.name : utils.getRandomFromArray(NameData);

  offer.features = typeof offer.features === `string` ? [offer.features] : offer.features;
  offer.photos = files && files.preview ?
    files.preview.map((p, i) => `/api/offers/${date}/preview/${i}`) :
    offer.photos || [];

  delete offer.name;
  delete offer.avatar;

  const author = {name, avatar: `/api/offers/${date}/avatar`};
  const location = getLocationFromAddress(offer.address);

  return {author, offer, location, date};
};

class OffersController {
  constructor(store, imagesStore) {
    this.store = store;
    this.imagesStore = imagesStore;
  }

  [saveImage](id, stream) {
    return this.imagesStore.save(id, stream);
  }

  [saveImages](files, id) {
    let avatarLoader = [];
    let loaders = [];

    if (files) {
      if (files.avatar) {
        avatarLoader.push(this[saveImage](id, toStream(files.avatar[0].buffer)));
      }

      if (files.preview) {
        loaders = files.preview.map(
            (p, i) => this[saveImage](`${id}_${i}`, toStream(p.buffer))
        );
      }
    }

    return loaders.concat(avatarLoader);
  }

  [getterImage](id) {
    return async (req, res) => {
      const result = await this.imagesStore.get(id);
      if (!result) {
        throw new NotFoundError(`An offer image not found`);
      }

      res.header(`Content-Type`, `image/jpg`);
      res.header(`Content-Length`, result.info.length);

      res.on(`error`, (e) => logger.error(e));
      res.on(`end`, () => res.end());

      const stream = result.stream;
      stream.on(`error`, (e) => logger.error(e));
      stream.on(`end`, () => res.end());
      stream.pipe(res);
    };
  }

  [check](data) {
    const valid = validate(data);

    if (!valid) {
      const message = validate.errors.map((err) => `${err.schemaPath}: ${err.message}`).join(`. `);
      throw new BadRequestError(message);
    }
  }

  getOffers() {
    return async (req, res) => {
      const skip = parseInt(req.query.skip, 10) || SKIP_DEFAULT;
      const limit = parseInt(req.query.limit, 10) || LIMIT_DEFAULT;

      const offers = await this.store.getOffers(skip, limit);

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
      const data = prepareData(req);
      this[check](data);

      const offer = enrichData(data, req.files);

      const result = await this.store.saveData(enrichData(data, req.files));
      await Promise.all(this[saveImages](req.files, result.insertedId));

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

      const getImage = this[getterImage](offer._id);
      await getImage(req, res);
    };
  }

  getPreview() {
    return async (req, res) => {
      const date = parseInt(req.params.date, 10);
      const offer = await this.store.getOffer(date);

      if (!offer) {
        throw new NotFoundError(`An offer with date: ${date} not found`);
      }

      const getImage = this[getterImage](`${offer._id}_${req.params.number}`);
      await getImage(req, res);
    };
  }
}

module.exports = OffersController;
