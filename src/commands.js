'use strict';

const utils = require(`./helpers/utils`);

const helpCommand = require(`./commands/help`);
const versionCommand = require(`./commands/version`);
const authorCommand = require(`./commands/author`);
const descriptionCommand = require(`./commands/description`);
const licenseCommand = require(`./commands/license`);
const serverCommand = require(`./commands/server`);
const defaultCommand = require(`./commands/default`);
const fillCommand = require(`./commands/fill`);
const errorCommand = require(`./commands/error`);

const commands = [helpCommand, versionCommand, authorCommand, descriptionCommand, licenseCommand, serverCommand, fillCommand];

const showError = Symbol(`error`);
const showDefault = Symbol(`default`);
const showMessage = Symbol(`answer`);


class Commands {
  constructor(command, params) {
    this.command = command;
    this.currentCommand = commands.find((c) => `--${c.name}` === command);
    this.params = params;
  }

  async [showError]() {
    await Promise.all([
      errorCommand.execute(this.command),
      helpCommand.execute(commands)
    ]);

    process.exit(utils.ConsoleStatus.ERROR);
  }

  async [showDefault]() {
    await defaultCommand.execute();
  }

  async [showMessage]() {
    if (this.command === helpCommand.name) {
      await helpCommand.execute(commands);
    } else {
      await this.currentCommand.execute(this.params);
    }
    process.exit(utils.ConsoleStatus.OK);
  }

  async showMessage() {
    if (this.currentCommand) {
      await this[showMessage]();
    } else if (this.command === void 0) {
      await this[showDefault]();
    } else {
      await this[showError]();
    }
  }
}

module.exports = Commands;
