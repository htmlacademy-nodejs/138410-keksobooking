'use strict';

const colors = require(`colors/safe`);

const logger = require(`../logger`);
const packageInfo = require(`../../package.json`);

module.exports = {
  name: `description`,
  description: `Shows program description`,
  execute() {
    logger.debug(`${colors.rainbow(packageInfo.description)}`);
  }
};
