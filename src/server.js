'use strict';

const http = require(`http`);
const path = require(`path`);
const url = require(`url`);
const fs = require(`fs`);
const {promisify} = require(`util`);
const readfile = promisify(fs.readFile);

const DEFAULT_PORT = 3000;
const HOSTNAME = `localhost`;
const DEFAULT_FOLDER = `/../static`;
const DEFAULT_FILENAME = `index.html`;
const MIME_TYPE = {
  'css': `text/css`,
  'html': `text/html; charset=UTF-8`,
  'jpg': `image/jpeg`,
  'png': `image/png`,
  'gif': `image/gif`,
  'ico': `image/x-icon`
};

const server = Symbol(`server`);
const readFile = Symbol(`readfile`);
const getAbsolutePath = Symbol(`absolutePath`);
const handler = Symbol(`handler`);

class Server {
  constructor(port = DEFAULT_PORT) {
    this.hostname = HOSTNAME;
    this.port = port;
  }

  [getAbsolutePath](requestUrl) {
    let localPath = url.parse(requestUrl).pathname;

    if (localPath.endsWith(`/`)) {
      localPath = localPath + DEFAULT_FILENAME;
    }

    return __dirname + DEFAULT_FOLDER + localPath;
  }

  start() {
    this[server] = http.createServer();
    this[server].on(`request`, (req, res) => this[handler](req, res));

    return new Promise(() => {
      this[server].listen(this.port, this.hostname, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`Server running at http://${this.hostname}:${this.port}`);
        }
      });
    });
  }

  async [handler](req, res) {
    const absolutePath = this[getAbsolutePath](req.url);

    await this[readFile](absolutePath, res);
  }

  async [readFile](absolutePath, res) {
    try {
      const data = await readfile(absolutePath);
      const extname = path.extname(absolutePath).slice(1);

      res.statusCode = 200;
      res.setHeader(`Content-Type`, MIME_TYPE[extname]);
      res.end(data);
    } catch (e) {
      console.error(e);
      res.end();
    }
  }
}

module.exports = Server;
