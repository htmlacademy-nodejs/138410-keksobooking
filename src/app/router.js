'use strict';

const express = require(`express`);

const getOffersRouter = require(`./offers/router`);

// eslint-disable-next-line new-cap
const router = express.Router();

router.use(`/api/offers`, getOffersRouter());

module.exports = router;
