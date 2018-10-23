'use strict';

const getOffersRouter = require(`./offers/router`);

const add = (app) => {
  app.use(`/api/offers`, getOffersRouter());
};

module.exports = {
  add
};
