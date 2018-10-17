'use strict';

const GenerateEntities = require(`../helpers/generate-entities`);
const NotFoundError = require(`../errors/not-found.js`);

const SKIP_DEFAULT = 0;
const LIMIT_DEFAULT = 20;

const generator = new GenerateEntities(40);
generator.generate();
const OFFERS = generator.getEntities();

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
  }
};

module.exports = {
  offersController,
  data: OFFERS
};
