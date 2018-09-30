'use strict';

const commands = require(`./src/commands/commands.js`);

const command = process.argv[2];

if (command) {
  commands.showMessage(command);
}
