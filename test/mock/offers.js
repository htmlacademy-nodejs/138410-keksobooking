'use strict';

const GenerateEntities = require(`../../src/helpers/generate-entities`);
const Cursor = require(`./cursor`);

const generator = new GenerateEntities(40);

class OffersStoreMock {
  constructor() {
    this.data = generator.generate();
  }

  async getOffer(date) {
    return this.data.find((it) => it.date === date);
  }

  async getOffers() {
    return new Cursor(this.data);
  }

  async saveData(data) {
    return data;
  }
}

module.exports = OffersStoreMock;
