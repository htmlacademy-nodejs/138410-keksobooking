'use strict';

const helpCommand = require(`./help.js`);
const versionCommand = require(`./version.js`);
const authorCommand = require(`./author.js`);
const descriptionCommand = require(`./description.js`);
const licenseCommand = require(`./license.js`);
const defaultCommand = require(`./default.js`);
const errorCommand = require(`./error.js`);

const commands = [helpCommand, versionCommand, authorCommand, descriptionCommand, licenseCommand];

module.exports = {
  showMessage(command) {
    const currentCommand = commands.find((c) => `--${c.name}` === command);

    if (currentCommand) {
      currentCommand.execute(commands);
      process.exit(0);
    } else if (command === void 0) {
      defaultCommand.execute();
    } else {
      errorCommand.execute(command);
      helpCommand.execute(commands);
      process.exit(1);
    }
  }
};
