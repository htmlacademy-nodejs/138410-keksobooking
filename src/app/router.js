'use strict';

const offers = require(`./offers/router`);

const add = (app) => {
  app.use(`/api/offers`, offers.router);
};

module.exports = {
  add,
  offersData: offers.data
};
