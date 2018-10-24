'use strict';

const colors = require(`colors/safe`);

const logger = require(`../logger`);
const packageInfo = require(`../../package.json`);

module.exports = {
  name: `license`,
  description: `Shows program license`,
  execute() {
    logger.debug(`${colors.random(packageInfo.license)}`);
  }
};
