'use strict';

const express = require(`express`);

const router = require(`./router`);
const errors = require(`./errors`);

const setup = Symbol(`setup`);

const DEFAULT_PORT = 3000;
const HOSTNAME = `localhost`;

class Server {
  constructor(port = DEFAULT_PORT) {
    this.hostname = HOSTNAME;
    this.port = port;
    this.app = express();
    this[setup]();
  }

  [setup]() {
    this.app.use(express.static(`static`));
    router.add(this.app);
    errors.add(this.app);
  }

  start() {
    return new Promise(() => {
      this.app.listen(this.port, () => console.log(`Server running at http://${this.hostname}:${this.port}`));
    });
  }
}

module.exports = Server;
