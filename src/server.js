'use strict';

const express = require(`express`);
const router = require(`./router.js`);

const setup = Symbol(`setup`);

const DEFAULT_PORT = 3000;
const HOSTNAME = `localhost`;

const NOT_FOUND_HANDLER = (req, res) => {
  res.status(404).send(`Page was not found`);
};

const ERROR_HANDLER = (err, req, res, _next) => {
  if (err) {
    console.error(err);
    res.status(err.code || 500).send(err.message);
  }
};

class Server {
  constructor(port = DEFAULT_PORT) {
    this.hostname = HOSTNAME;
    this.port = port;
    this.app = express();
    this.offersData = router.offersData;
    this[setup]();
  }

  [setup]() {
    this.app.use(express.static(`static`));

    router.add(this.app);
    this.app.use(NOT_FOUND_HANDLER);
    this.app.use(ERROR_HANDLER);
  }

  start() {
    return new Promise(() => {
      this.app.listen(this.port, () => console.log(`Server running at http://${this.hostname}:${this.port}`));
    });
  }
}

module.exports = Server;
