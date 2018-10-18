'use strict';

class NotFoundError extends Error {
  constructor(message) {
    super(message || `Not found`);
    this.code = 404;
  }
}

module.exports = NotFoundError;
