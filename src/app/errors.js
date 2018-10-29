'use strict';

const logger = require(`../logger`);

const NOT_FOUND_HANDLER = (req, res) => {
  res.status(404).send(`Page was not found`);
};

const ERROR_HANDLER = (err, req, res, _next) => {
  if (err) {
    const status = err.code || 500;
    logger.error(`status: ${status}, message: ${err.message}`);
    res.status(status).send(err.message);
  }
};

module.exports = {
  NOT_FOUND_HANDLER,
  ERROR_HANDLER
};
