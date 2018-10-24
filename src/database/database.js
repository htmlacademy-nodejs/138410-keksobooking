'use strict';

const {MongoClient} = require(`mongodb`);
const logger = require(`../logger`);

const {DB_HOST, DB_NAME} = process.env;

const url = `mongodb://${DB_HOST}`;

const connect = () => {
  return MongoClient.connect(url, {useNewUrlParser: true})
    .then((client) => client.db(DB_NAME))
    .catch((e) => {
      logger.error(`Failed to connect to MongoDB`, e);
      process.exit(1);
    });
};

module.exports = connect;
