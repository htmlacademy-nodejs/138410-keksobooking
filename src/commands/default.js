'use strict';

const colors = require(`colors/safe`);

const packageInfo = require(`../../package.json`);
const GenerateData = require(`../generate-data`);

const DEFAULT_MESSAGE = `Salut!
This app will run the server „${colors.underline(packageInfo.name)}“.
Author: ${colors.underline(packageInfo.author)}.`;

module.exports = {
  name: `default`,
  description: `Shows default message`,
  async execute() {
    console.log(DEFAULT_MESSAGE);

    const generateData = new GenerateData();
    await generateData.start();
  }
};
