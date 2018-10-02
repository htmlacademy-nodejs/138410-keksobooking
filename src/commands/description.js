'use strict';

const colors = require(`colors/safe`);

const packageInfo = require(`../../package.json`);

module.exports = {
  name: `description`,
  description: `Shows program description`,
  execute() {
    console.log(`${colors.rainbow(packageInfo.description)}`);
  }
};
