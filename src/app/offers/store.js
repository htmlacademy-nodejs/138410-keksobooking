'use strict';

const databaseConnect = require(`../../database/database`);

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

  async getOffers() {
    return (await this.collection).find();
  }

  async saveData(data) {
    return (await this.collection).insertOne(data);
  }
}

module.exports = OffersStore;
