'use strict';

const {MongoClient} = require(`mongodb`);

const url = `mongodb://localhost:27017`;

const connect = () => {
  return MongoClient.connect(url, {useNewUrlParser: true})
    .then((client) => client.db(`keksobooking`))
    .catch((e) => {
      console.error(`Failed to connect to MongoDB`, e);
      process.exit(1);
    });
};

module.exports = connect;
