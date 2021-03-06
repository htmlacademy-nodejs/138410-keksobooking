'use strict';

const asyncMiddleware = (fn) => (req, res, next) => fn(req, res, next).catch(next);

const utils = {
  ConsoleStatus: {
    OK: 0,
    ERROR: 1
  },

  getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  },

  exchangeArrayElements(array, i, j) {
    [array[i], array[j]] = [array[j], array[i]];
  },

  shuffleArray(array) {
    let localArray = array.slice(0);
    for (let i = array.length - 1; i > 0; i--) {
      let j = this.getRandom(0, i + 1);
      this.exchangeArrayElements(array, i, j);
    }
    return localArray;
  },

  createArrayRandomLength(min, array) {
    const num = this.getRandom(min, array.length + 1);
    return this.shuffleArray(array).slice(0, num + 1);
  },

  getRandomFromArray(array) {
    return array[this.getRandom(0, array.length)];
  },

  asyncMiddleware
};

module.exports = utils;
