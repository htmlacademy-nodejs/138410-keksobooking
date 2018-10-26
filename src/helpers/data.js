'use strict';

const PlaceValue = {
  MIN_PRICE: 1000,
  MAX_PRICE: 1000000,
  MIN_ROOMS: 1,
  MAX_ROOMS: 1000,
  MIN_FEATURES: 1,
  NUMBER_OF_PLACES: 1
};

const PlaceData = {
  OFFER_TITLES: [`Большая уютная квартира`, `Маленькая неуютная квартира`, `Огромный прекрасный дворец`, `Маленький ужасный дворец`, `Красивый гостевой домик`, `Некрасивый негостеприимный домик`, `Уютное бунгало далеко от моря`, `Неуютное бунгало по колено в воде`],
  OFFER_TYPES: [`flat`, `house`, `bungalo`, `palace`],
  CHECK_TIMES: [`12:00`, `13:00`, `14:00`],
  OFFER_FEATURES: [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`],
  PHOTOS: [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`]
};

const NameData = [`Keks`, `Pavel`, `Nikolay`, `Alex`, `Ulyana`, `Anastasyia`, `Julia`];

const LocationValue = {
  MIN_X: 300,
  MAX_X: 900,
  MIN_Y: 150,
  MAX_Y: 500
};

module.exports = {
  PlaceValue,
  PlaceData,
  NameData,
  LocationValue
};
