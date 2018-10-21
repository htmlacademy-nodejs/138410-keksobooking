'use strict';

const express = require(`express`);
const multer = require(`multer`);

const {offersController, data} = require(`./controller`);

// eslint-disable-next-line new-cap
const router = express.Router();
const jsonParser = express.json();

const upload = multer({storage: multer.memoryStorage()});
const allowedImages = [{name: `avatar`, maxCount: 1}, {name: `preview`, maxCount: 1}];

router.get(``, offersController.getOffers);

router.get(`/:date`, offersController.getOfferByDate);

router.post(``, jsonParser, upload.fields(allowedImages), offersController.postOffer);

module.exports = {
  router,
  data
};
