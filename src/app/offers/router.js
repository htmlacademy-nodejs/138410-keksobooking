'use strict';

const express = require(`express`);
const multer = require(`multer`);

const OffersController = require(`./controller`);
const OffersStore = require(`./store`);
const ImagesStore = require(`./images-store`);
const {asyncMiddleware} = require(`../../helpers/utils`);

const getRouter = (store, imgStore) => {
  // eslint-disable-next-line new-cap
  const router = express.Router();
  const jsonParser = express.json();

  const offersStore = store || new OffersStore();
  const imagesStore = imgStore || new ImagesStore();
  const offersController = new OffersController(offersStore, imagesStore);

  const upload = multer({storage: multer.memoryStorage()});
  const allowedImages = [{name: `avatar`, maxCount: 1}, {name: `preview`, maxCount: 1}];

  router.get(``, asyncMiddleware(offersController.getOffers()));
  router.get(`/:date`, asyncMiddleware(offersController.getOfferByDate()));
  router.get(`/:date/avatar`, asyncMiddleware(offersController.getAvatar()));
  router.post(``, jsonParser, upload.fields(allowedImages), asyncMiddleware(offersController.postOffer()));

  return router;
};

module.exports = getRouter;
