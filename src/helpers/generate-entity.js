'use strict';

const PlaceValue = {
  MIN_PRICE: 1000,
  MAX_PRICE: 1000000,
  MIN_ROOMS: 1,
  MAX_ROOMS: 5,
  MIN_FEATURES: 1,
  NUMBER_OF_PLACES: 8
};

const PlaceData = {
  OFFER_TITLES: [`Большая уютная квартира`, `Маленькая неуютная квартира`, `Огромный прекрасный дворец`, `Маленький ужасный дворец`, `Красивый гостевой домик`, `Некрасивый негостеприимный домик`, `Уютное бунгало далеко от моря`, `Неуютное бунгало по колено в воде`],
  OFFER_TYPES: [`flat`, `house`, `bungalo`],
  CHECK_TIMES: [`12:00`, `13:00`, `14:00`],
  OFFER_FEATURES: [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`],
  PHOTOS: [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`]
};

const [X_MIN, X_MAX] = [300, 900];
const [Y_MIN, Y_MAX] = [150, 500];

const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const exchangeArrayElements = (array, i, j) => {
  let tmp = array[i];
  array[i] = array[j];
  array[j] = tmp;
};

const shuffleArray = (array) => {
  let localArray = array.slice(0);
  for (let i = array.length - 1; i > 0; i--) {
    let j = getRandom(0, i + 1);
    exchangeArrayElements(array, i, j);
  }
  return localArray;
};

const getOneOf = (array) => {
  return array[getRandom(0, array.length)];
};

const createLocation = () => {
  return {x: getRandom(X_MIN, X_MAX + 1), y: getRandom(Y_MIN, Y_MAX + 1)};
};

const createArrayRandomLength = (min, array) => {
  const num = getRandom(min, array.length + 1);
  return shuffleArray(array).slice(0, num + 1);
};

function generateEntity() {
  const place = {};
  const avatarPath = `https://image.shutterstock.com/image-vector/smiling-girl-avatar-cute-woman-260nw-1018322197.jpg`;
  place.author = {avatar: avatarPath};

  place.location = createLocation();

  place.offer = {
    title: getOneOf(PlaceData.OFFER_TITLES),
    address: `${place.location.x}, ${place.location.y}`,
    price: getRandom(PlaceValue.MIN_PRICE, PlaceValue.MAX_PRICE + 1),
    type: PlaceData.OFFER_TYPES[getRandom(0, PlaceData.OFFER_TYPES.length)],
    rooms: getRandom(PlaceValue.MIN_ROOMS, PlaceValue.MAX_ROOMS + 1),
    guests: getRandom(PlaceValue.MIN_ROOMS + 3, PlaceValue.MAX_ROOMS + 4),
    checkin: PlaceData.CHECK_TIMES[getRandom(0, PlaceData.CHECK_TIMES.length)],
    checkout: PlaceData.CHECK_TIMES[getRandom(0, PlaceData.CHECK_TIMES.length)],
    features: createArrayRandomLength(PlaceValue.MIN_FEATURES, PlaceData.OFFER_FEATURES),
    description: ``,
    photos: shuffleArray(PlaceData.PHOTOS)
  };

  const minDate = new Date();
  const maxDate = new Date();
  minDate.setDate(maxDate.getDate() - 7);
  place.date = getRandom(minDate.getTime(), maxDate.getTime() + 1);

  return place;
}

module.exports = generateEntity;
