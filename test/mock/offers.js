'use strict';

const GenerateEntities = require(`../../src/helpers/generate-entities`);

const generator = new GenerateEntities(40);

class OffersStoreMock {
  constructor() {
    this.data = generator.generate();
  }

  async getOffer(date) {
    return this.data.find((it) => it.date === date);
  }

  async getOffers(skip, limit) {
    return this.data.slice(skip, skip + limit);
  }

  async saveData(data) {
    return data;
  }
}

module.exports = OffersStoreMock;
