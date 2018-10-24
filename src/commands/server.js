'use strict';

const Server = require(`../app/server`);
const logger = require(`../logger`);

module.exports = {
  name: `server`,
  description: `Starts the app server`,
  execute(params) {
    let port = params[0];

    if (port) {
      try {
        port = parseInt(port, 10);
      } catch (e) {
        logger.error(e);
      }
    }

    return (new Server(port)).start();
  }
};
