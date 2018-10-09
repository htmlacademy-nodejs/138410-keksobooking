'use strict';

const commands = require(`./src/commands/commands.js`);
const GenerateData = require(`./src/generate-data/generate-data.js`);

const command = process.argv[2];

commands.showMessage(command);

setImmediate(() => {
  const generateData = new GenerateData();
  generateData.start();
});
