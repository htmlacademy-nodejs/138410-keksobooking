'use strict';

const colors = require(`colors/safe`);

const packageInfo = require(`../../package.json`);

module.exports = {
  name: `license`,
  description: `Shows program license`,
  execute() {
    console.log(`${colors.random(packageInfo.license)}`);
  }
};
