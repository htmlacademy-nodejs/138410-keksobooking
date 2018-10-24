'use strict';

const colors = require(`colors/safe`);

const logger = require(`../logger`);
const packageInfo = require(`../../package.json`);

module.exports = {
  name: `author`,
  description: `Shows program author`,
  execute() {
    logger.debug(`${colors.italic(packageInfo.author)}`);
  }
};
