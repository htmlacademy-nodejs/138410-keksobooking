'use strict';

const offers = require(`./routers/offers.js`);

const add = (app) => {
  app.use(`/api/offers`, offers.router);
};

module.exports = {
  add,
  offersData: offers.data
};
