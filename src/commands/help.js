'use strict';

const colors = require(`colors/safe`);

const HELP_PREMESSAGE = `Usage: `;

function getMessage(commands) {
  return commands.reduce(
      (message, command) => `${message}\n--${colors.gray(command.name)} — ${colors.green(command.description)}`,
      HELP_PREMESSAGE
  );
}

module.exports = {
  name: `help`,
  description: `Shows program help`,
  execute(commands) {
    console.log(getMessage(commands));
  }
};
