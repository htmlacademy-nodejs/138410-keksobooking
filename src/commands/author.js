'use strict';

const colors = require(`colors/safe`);

const packageInfo = require(`../../package.json`);

module.exports = {
  name: `author`,
  description: `Shows program author`,
  execute() {
    console.log(`${colors.italic(packageInfo.author)}`);
  }
};
