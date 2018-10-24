'use strict';

const colors = require(`colors/safe`);

const logger = require(`../logger`);
const packageInfo = require(`../../package.json`);

module.exports = {
  name: `version`,
  description: `Shows program version`,
  execute() {
    const [major, minor, patch] = packageInfo.version.split(`.`);
    logger.debug(`v${colors.red(major)}.${colors.green(minor)}.${colors.blue(patch)}`);
  }
};
