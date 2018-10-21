'use strict';

const utils = require(`./utils`);
const {PlaceData, PlaceValue, LocationValue} = require(`./data`);

const createLocation = Symbol(`location`);
const generateEntity = Symbol(`entity`);

class generateEntities {
  constructor(valueOfEntities = PlaceValue.NUMBER_OF_PLACES) {
    this.value = valueOfEntities;
    this.entities = [];
    this.generate();
  }

  [createLocation]() {
    return {x: utils.getRandom(LocationValue.MIN_X, LocationValue.MAX_X + 1), y: utils.getRandom(LocationValue.MIN_Y, LocationValue.MAX_Y + 1)};
  }

  [generateEntity](title) {
    const place = {};
    const avatarPath = `https://image.shutterstock.com/image-vector/smiling-girl-avatar-cute-woman-260nw-1018322197.jpg`;
    place.author = {avatar: avatarPath};

    place.location = this[createLocation]();

    place.offer = {
      title,
      address: `${place.location.x}, ${place.location.y}`,
      price: utils.getRandom(PlaceValue.MIN_PRICE, PlaceValue.MAX_PRICE + 1),
      type: PlaceData.OFFER_TYPES[utils.getRandom(0, PlaceData.OFFER_TYPES.length)],
      rooms: utils.getRandom(PlaceValue.MIN_ROOMS, PlaceValue.MAX_ROOMS + 1),
      guests: utils.getRandom(PlaceValue.MIN_ROOMS + 3, PlaceValue.MAX_ROOMS + 4),
      checkin: PlaceData.CHECK_TIMES[utils.getRandom(0, PlaceData.CHECK_TIMES.length)],
      checkout: PlaceData.CHECK_TIMES[utils.getRandom(0, PlaceData.CHECK_TIMES.length)],
      features: utils.createArrayRandomLength(PlaceValue.MIN_FEATURES, PlaceData.OFFER_FEATURES),
      description: ``,
      photos: utils.shuffleArray(PlaceData.PHOTOS)
    };

    const minDate = new Date();
    const maxDate = new Date();
    minDate.setDate(maxDate.getDate() - 7);
    place.date = utils.getRandom(minDate.getTime(), maxDate.getTime() + 1);

    return place;
  }

  generate() {
    const places = [];
    const offerTitles = utils.shuffleArray(PlaceData.OFFER_TITLES);

    for (let i = 0; i < this.value; i++) {
      places[i] = this[generateEntity](offerTitles[i % offerTitles.length]);
    }

    this.entities = places;
  }

  getEntities() {
    return this.entities;
  }
}

module.exports = generateEntities;
