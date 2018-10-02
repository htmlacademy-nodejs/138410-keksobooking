'use strict';

const colors = require(`colors/safe`);

const ERROR_MESSAGE = `The unknown command „{command}“.`;

module.exports = {
  name: `error`,
  description: `Shows program error`,
  execute(command) {
    console.error(ERROR_MESSAGE.replace(`{command}`, colors.bgMagenta(command)));
  }
};
