'use strict';

const express = require(`express`);

const logger = require(`../logger`);
const router = require(`./router`);
const errors = require(`./errors`);

const setup = Symbol(`setup`);

const {SERVER_PORT, SERVER_HOST} = process.env;

const allowCORS = (req, res, next) => {
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.header(`Access-Control-Allow-Headers`, `Origin, X-Requested-With, Content-Type, Accept`);
  next();
};

class Server {
  constructor(port = SERVER_PORT) {
    this.hostname = SERVER_HOST;
    this.port = port;
    this.app = express();
    this[setup]();
  }

  [setup]() {
    this.app.use(express.static(`static`));
    this.app.use(allowCORS);
    router.add(this.app);
    errors.add(this.app);
  }

  start() {
    return new Promise(() => {
      this.app.listen(this.port, () => logger.debug(`Server running at http://${this.hostname}:${this.port}`));
    });
  }
}

module.exports = Server;
