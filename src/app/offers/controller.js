'use strict';

const Ajv = require(`ajv`);

const BadRequestError = require(`../errors/bad-request`);
const NotFoundError = require(`../errors/not-found`);

const schema = require(`./schema`);

const GenerateEntities = require(`../../helpers/generate-entities`);
const utils = require(`../../helpers/utils`);
const {NameData} = require(`../../helpers/data`);

const SKIP_DEFAULT = 0;
const LIMIT_DEFAULT = 20;

const generator = new GenerateEntities(40);
generator.generate();
const OFFERS = generator.getEntities();

const ajv = new Ajv({allErrors: true, coerceTypes: true});
const validate = ajv.compile(schema);

const getLocationFromAddress = (address) => {
  const [x, y] = address.replace(` `, ``).split(`,`);

  return {
    x: parseInt(x, 10),
    y: parseInt(y, 10)
  };
};

const offersController = {
  getOffers(req, res) {
    const skip = parseInt(req.query.skip, 10) || SKIP_DEFAULT;
    const limit = parseInt(req.query.limit, 10) || LIMIT_DEFAULT;

    res.send(OFFERS.slice(skip, skip + limit));
  },

  getOfferByDate(req, res) {
    const date = parseInt(req.params.date, 10);
    const offer = OFFERS.find((item) => item.date === date);

    if (!offer) {
      throw new NotFoundError(`An offer with date: ${date} not found`);
    }

    res.send(offer);
  },

  postOffer(req, res) {
    const body = req.body;
    const valid = validate(body);

    const files = req.files;
    if (files && files.avatar) {
      body.avatar = files.avatar[0].originalname;
    }

    if (files && files.preview) {
      body.preview = files.preview[0].originalname;
    }

    if (!valid) {
      const message = validate.errors.map((err) => `${err.schemaPath}: ${err.message}`).join(`. `);
      throw new BadRequestError(message);
    }

    if (!body.name) {
      body.name = utils.getRandomFromArray(NameData);
    }

    body.location = getLocationFromAddress(body.address);

    res.send(req.body);
  }
};

module.exports = {
  offersController,
  data: OFFERS
};
