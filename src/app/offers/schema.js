'use strict';

const {PlaceData, PlaceValue} = require(`../../helpers/data`);

const schema = {
  "title": `offer`,
  "properties": {
    "name": {
      "type": `string`
    },
    "title": {
      "type": `string`
    },
    "avatar": {
      "type": `string`,
      "pattern": `.(jpeg|jpg|gif|png)`
    },
    "photos": {
      oneOf: [{
        "type": `array`,
        "items": {
          "type": `string`,
          "pattern": `.(jpeg|jpg|gif|png)`
        },
        "uniqueItems": true,
        "minItems": 0
      }, {
        "type": `string`,
        "pattern": `.(jpeg|jpg|gif|png)`
      }]
    },
    "address": {
      "type": `string`,
      "pattern": `^[\\d]+,[\\s]{0,1}[\\d]+$`
    },
    "description": {
      "type": `string`
    },
    "price": {
      "type": `number`,
      "minimum": PlaceValue.MIN_PRICE,
      "maximum": PlaceValue.MAX_PRICE
    },
    "type": {
      "type": `string`,
      "enum": PlaceData.OFFER_TYPES
    },
    "rooms": {
      "type": `integer`,
      "minimum": PlaceValue.MIN_ROOMS,
      "maximum": PlaceValue.MAX_ROOMS
    },
    "guests": {
      "type": `integer`
    },
    "checkin": {
      "type": `string`,
      "enum": PlaceData.CHECK_TIMES
    },
    "checkout": {
      "type": `string`,
      "enum": PlaceData.CHECK_TIMES
    },
    "features": {
      oneOf: [{
        "type": `array`,
        "items": {
          "type": `string`,
          "enum": PlaceData.OFFER_FEATURES
        },
        "uniqueItems": true,
        "minItems": 1
      }, {
        "type": `string`,
        "enum": PlaceData.OFFER_FEATURES
      }]
    }
  },
  "required": [`title`, `address`, `description`, `price`, `type`, `rooms`, `guests`, `checkin`, `checkout`, `features`]
};

module.exports = schema;
