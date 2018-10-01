'use strict';

const HELP_PREMESSAGE = `Usage: `;

function getMessage(commands) {
  return commands.reduce(
      (message, command) => `${message}\n--${command.name} ${command.description.toLowerCase()}`,
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
