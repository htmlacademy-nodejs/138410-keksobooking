'use strict';

class BadRequestError extends Error {
  constructor(message) {
    super(message || `Bad Request`);
    this.code = 400;
  }
}

module.exports = BadRequestError;
