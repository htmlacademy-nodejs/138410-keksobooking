'use strict';

const databaseConnect = require(`../../database/database`);

const SKIP_DEFAULT = 0;
const LIMIT_DEFAULT = 20;

const setupCollection = async () => {
  const db = await databaseConnect();

  const collection = db.collection(`offers`);
  collection.createIndex({date: -1}, {unique: true});
  return collection;
};

class OffersStore {
  constructor() {
    this.collection = setupCollection().
      catch((e) => console.error(`Failed to set up the offers collection`, e));
  }

  async getOffer(date) {
    return (await this.collection).findOne({date});
  }

  async getOffers(skip = SKIP_DEFAULT, limit = LIMIT_DEFAULT) {
    const cursor = (await this.collection).find();
    return (await cursor.skip(skip).limit(limit).toArray());
  }

  async saveData(data) {
    return (await this.collection).insertOne(data);
  }
}

module.exports = OffersStore;
