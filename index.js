const commandList = {
  VERSION: `--version`,
  HELP: `--help`
};

const VERSION = `v0.0.1`;
const HELP_MESSAGE = `Usage:
--help: Show this message
--version: Print out the installed version of the app`;
const DEFAULT_MESSAGE = `Salut!
This app will run the server „Keksobooking“.
Author: Olga Kotova.`;
const ERROR_MESSAGE = `The unknown command „%command“. Use the „${commandList.HELP}“ to get an information.`

const command = process.argv[2];

switch (command) {
  case commandList.VERSION:
    console.log(VERSION);
    process.exit(0);

  case commandList.HELP:
    console.log(HELP_MESSAGE);
    process.exit(0);

  case (void 0):
    console.log(DEFAULT_MESSAGE);
    process.exit(0);

  default:
    console.error(ERROR_MESSAGE.replace('%command', command));
    process.exit(1);
}
