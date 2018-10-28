'use strict';

const logger = require(`../logger`);

const OffersStore = require(`../app/offers/store`);
const GenerateEntities = require(`../helpers/generate-entities`);

const VALUE_OF_ENTITES = 15;

module.exports = {
  name: `fill`,
  description: `Fill data to database`,
  async execute() {
    const store = new OffersStore();
    const generator = new GenerateEntities(VALUE_OF_ENTITES);
    const data = generator.generate(VALUE_OF_ENTITES);

    const allData = [];
    data.forEach((d) => allData.push(store.saveData(d)));
    await Promise.all(allData).then(() => {
      logger.debug(`Data was filled.`);
    });
  }
};
