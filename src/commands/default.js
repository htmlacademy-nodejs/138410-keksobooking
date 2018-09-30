'use strict';

const packageInfo = require(`../../package.json`);

const DEFAULT_MESSAGE = `Salut!
This app will run the server „${packageInfo.name}“.
Author: ${packageInfo.author}.`;

module.exports = {
  name: `default`,
  description: `Shows default message`,
  execute() {
    console.log(DEFAULT_MESSAGE);
  }
};
