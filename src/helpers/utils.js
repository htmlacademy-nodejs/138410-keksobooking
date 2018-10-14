'use strict';

module.exports = {
  ConsoleStatus: {
    OK: 0,
    ERROR: 1
  },

  getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  },

  exchangeArrayElements(array, i, j) {
    let tmp = array[i];
    array[i] = array[j];
    array[j] = tmp;
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
  }
};
