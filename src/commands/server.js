'use strict';

const Server = require(`../server.js`);

module.exports = {
  name: `server`,
  description: `Starts the app server`,
  execute(params) {
    let port = params[0];

    if (port) {
      try {
        port = parseInt(port, 10);
      } catch (e) {
        console.error(e);
      }
    }

    return (new Server(port)).run();
  }
};
