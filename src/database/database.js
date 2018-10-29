'use strict';

const {MongoClient} = require(`mongodb`);
const logger = require(`../logger`);

const {DB_HOST, DB_NAME} = process.env;
const HOST = DB_HOST || `localhost:27017`;
const NAME = DB_NAME || `keksobooking`;


const url = `mongodb://${HOST}`;

const connect = () => {
  return MongoClient.connect(url, {useNewUrlParser: true})
    .then((client) => client.db(NAME))
    .catch((e) => {
      logger.error(`Failed to connect to MongoDB`, e);
      process.exit(1);
    });
};

module.exports = connect;
