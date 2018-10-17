'use strict';

const express = require(`express`);
const {offersController, data} = require(`../controllers/offers`);

// eslint-disable-next-line new-cap
const router = express.Router();

router.get(``, offersController.getOffers);

router.get(`/:date`, offersController.getOfferByDate);

module.exports = {
  router,
  data
};
