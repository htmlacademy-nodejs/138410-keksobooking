'use strict';

const express = require(`express`);

const logger = require(`../logger`);
const router = require(`./router`);
const {NOT_FOUND_HANDLER, ERROR_HANDLER} = require(`./errors`);

const setup = Symbol(`setup`);

const {SERVER_PORT, SERVER_HOST} = process.env;
const PORT = SERVER_PORT || 3000;
const HOSTNAME = SERVER_HOST || `localhost`;

const allowCORS = (req, res, next) => {
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.header(`Access-Control-Allow-Headers`, `Origin, X-Requested-With, Content-Type, Accept`);
  next();
};

class Server {
  constructor(port = PORT) {
    this.hostname = HOSTNAME;
    this.port = port;
    this.app = express();
    this[setup]();
  }

  [setup]() {
    this.app.use(express.static(`static`));
    this.app.use(allowCORS);
    this.app.use(`/`, router);
    this.app.use(NOT_FOUND_HANDLER);
    this.app.use(ERROR_HANDLER);
  }

  start() {
    return new Promise(() => {
      this.app.listen(this.port, () => logger.debug(`Server running at http://${this.hostname}:${this.port}`));
    });
  }
}

module.exports = Server;
