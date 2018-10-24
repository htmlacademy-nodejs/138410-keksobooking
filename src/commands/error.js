'use strict';

const colors = require(`colors/safe`);
const logger = require(`../logger`);

const ERROR_MESSAGE = `The unknown command „{command}“.`;

module.exports = {
  name: `error`,
  description: `Shows program error`,
  execute(command) {
    logger.error(ERROR_MESSAGE.replace(`{command}`, colors.bgMagenta(command)));
  }
};
