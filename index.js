'use strict';

const commands = require(`./src/commands/commands.js`);

const command = process.argv[2];

commands.showMessage(command);
