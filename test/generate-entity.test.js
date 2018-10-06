'use strict';

const assert = require(`assert`);
const generateEntity = require(`../src/helpers/generate-entity`);

const isString = (value) => typeof value === `string`;

const isNumber = (value) => typeof value === `number`;

const isObject = (value) => typeof value === `object` && !Array.isArray(value);

const isArrayOf = (check) => {
  return (values) => {
    let result = Array.isArray(values);
    if (result) {
      for (const val of values) {
        result = result && check(val);
      }
    }

    return result;
  };
};

const getCheckingString = (exp) => {
  return (value) => {
    return isString(value) && exp.test(value);
  };
};

const getCheckingStringValue = (valuesList) => {
  return (value) => {
    return isString(value) && valuesList.includes(value);
  };
};

const getCheckingNumber = (min, max) => {
  return (value) => {
    let result = isNumber(value);

    if (isNumber(min)) {
      result = result && value >= min;
    }
    if (isNumber(max)) {
      result = result && value <= max;
    }

    return result;
  };
};

const getCheckingArray = (array) => {
  return (valuesArray) => {
    let result = Array.isArray(valuesArray) && valuesArray.length;
    if (result) {
      for (const val of valuesArray) {
        result = result && array.includes(val);
      }
    }

    return result;
  };
};

const isImage = getCheckingString(/^(http(s?):\/\/?)([\S]*).(jpg|gif|png)/i);
const authorProperties = [`avatar`];

const offerProperties = [
  `title`, `address`, `price`, `type`, `rooms`, `guests`,
  `checkin`, `checkout`, `features`, `description`, `photos`
];
const titleValues = [`Большая уютная квартира`, `Маленькая неуютная квартира`, `Огромный прекрасный дворец`, `Маленький ужасный дворец`, `Красивый гостевой домик`, `Некрасивый негостеприимный домик`, `Уютное бунгало далеко от моря`, `Неуютное бунгало по колено в воде`];
const isTitle = getCheckingStringValue(titleValues);

const [priceMin, priceMax] = [1000, 1000000];
const isPrice = getCheckingNumber(priceMin, priceMax);

const typeValues = [`flat`, `palace`, `house`, `bungalo`];
const isType = getCheckingStringValue(typeValues);

const [roomsMin, roomsMax] = [1, 5];
const isRooms = getCheckingNumber(roomsMin, roomsMax);

const timeValues = [`12:00`, `13:00`, `14:00`];
const isTime = getCheckingStringValue(timeValues);

const featuresValues = [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`];
const isFeatures = getCheckingArray(featuresValues);

const isPhotos = isArrayOf(isImage);

const locationProperties = [`x`, `y`];
const [xMin, xMax] = [300, 900];
const [yMin, yMax] = [150, 500];
const isXPoint = getCheckingNumber(xMin, xMax);
const isYPoint = getCheckingNumber(yMin, yMax);

describe(`generateEntity`, function () {
  const data = generateEntity();

  describe(`author`, function () {
    const {author} = data;

    it(`should be an object`, function () {
      if (!(author && isObject(author))) {
        assert.fail(`author should be an object`);
      }
    });

    it(`should have an avatar property`, function () {
      assert.deepStrictEqual(Object.keys(author), authorProperties, `author doesn't have an avatar property`);
      if (!isImage(author.avatar)) {
        assert.fail(`avatar should be an image path`);
      }
    });
  });

  describe(`offer`, function () {
    const {offer} = data;

    it(`should be an object`, function () {
      if (offer && isObject(offer)) {
        assert.deepStrictEqual(Object.keys(offer), offerProperties, `offer doesn't have necessary properties`);
      } else {
        assert.fail(`author should be an object`);
      }
    });

    it(`should have a correct title property`, function () {
      if (!isTitle(offer.title)) {
        assert.fail(`title should be one of ${titleValues}, but it's a ${offer.title}`);
      }
    });

    it(`should have a correct address property`, function () {
      if (!isString(offer.address)) {
        assert.fail(`address should be a string, but it's ${typeof offer.address}`);
      }
      assert.strictEqual(`${data.location.x}, ${data.location.y}`, offer.address);
    });

    it(`should have a correct price property`, function () {
      if (!isPrice(offer.price)) {
        assert.fail(`price should be a number from ${priceMin} to ${priceMax}, but it's ${offer.price}`);
      }
    });

    it(`should have a correct type property`, function () {
      if (!isType(offer.type)) {
        assert.fail(`type should be one of ${typeValues}`);
      }
    });

    it(`should have a correct rooms property`, function () {
      if (!isRooms(offer.rooms)) {
        assert.fail(`rooms should be a number from ${roomsMin} to ${roomsMax}, but it's ${offer.rooms}`);
      }
    });

    it(`should have a correct guests property`, function () {
      if (!isNumber(offer.guests)) {
        assert.fail(`guests should be a number, but it's ${typeof offer.guests}`);
      }
    });

    it(`should have a correct checkin, checkout properties`, function () {
      if (!isTime(offer.checkin)) {
        assert.fail(`checkin should be one of ${timeValues}`);
      }
      if (!isTime(offer.checkout)) {
        assert.fail(`checkout should be one of ${timeValues}`);
      }
    });

    it(`should have a correct features property`, function () {
      if (!Array.isArray(offer.features)) {
        assert.fail(`features should be an array, but it's ${typeof offer.features}`);
      }
      if (!isFeatures(offer.features)) {
        assert.fail(`features should be an array, where every value are one of ${featuresValues}, but it's ${offer.features}`);
      }
    });

    it(`should have a correct description property`, function () {
      assert.strictEqual(``, offer.description);
    });

    it(`should have a correct photos property`, function () {
      if (!Array.isArray(offer.photos)) {
        assert.fail(`photos should be an array, but it's ${typeof offer.photos}`);
      }
      if (!isPhotos(offer.photos)) {
        assert.fail(`photos should be an array, where every value be an image path`);
      }
    });
  });

  describe(`location`, function () {
    const {location} = data;
    it(`should have a correct location property`, function () {
      if (!isObject(location)) {
        assert.fail(`location should be an object, but it's ${typeof location}`);
      }
      assert.deepStrictEqual(Object.keys(location), locationProperties, `location doesn't have necessary properties`);
      if (!isXPoint(location.x)) {
        assert.fail(`location x should be a number from ${xMin} to ${xMax}, but it's ${location.x}`);
      }

      if (!isYPoint(location.y)) {
        assert.fail(`location y should be a number from ${yMin} to ${yMax}, but it's ${location.y}`);
      }
    });
  });

  describe(`date`, function () {
    const {date} = data;
    it(`should have a correct date property`, function () {
      const minDate = new Date();
      const maxDate = new Date();
      minDate.setDate(maxDate.getDate() - 7);

      if (!(date >= minDate.getTime() && date <= maxDate.getTime())) {
        assert.fail(`date should be a date from ${minDate.getTime()} to ${maxDate.getTime()}, but it's ${date}`);
      }
    });
  });
});
