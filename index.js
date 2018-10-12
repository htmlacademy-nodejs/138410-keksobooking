'use strict';

const Commands = require(`./src/commands.js`);

const command = process.argv[2];
const params = process.argv.slice(3);

const commands = new Commands(command, params);
commands.showMessage();
