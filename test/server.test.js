'use strict';

const request = require(`supertest`);
const assert = require(`assert`);

const Server = require(`../src/app/server`);
const {NameData} = require(`../src/helpers/data`);

const server = new Server();
const app = server.app;

describe(`GET /api/offers`, () => {
  it(`get all offers without query`, async () => {
    const offer = server.offersData[0];

    const response = await request(app)
      .get(`/api/offers`)
      .set(`Accept`, `application/json`)
      .expect(200)
      .expect(`Content-Type`, /json/);

    const reqOffers = response.body;
    assert.equal(reqOffers.length, 20);
    assert.deepStrictEqual(reqOffers[0], offer);
  });

  it(`get all offers: skip = 5, limit = 10`, async () => {
    const offer = server.offersData[5];

    const response = await request(app)
      .get(`/api/offers/`)
      .query({skip: 5, limit: 10})
      .set(`Accept`, `application/json`)
      .expect(200)
      .expect(`Content-Type`, /json/);

    const reqOffers = response.body;
    assert.strictEqual(reqOffers.length, 10);
    assert.deepStrictEqual(reqOffers[0], offer);
  });
});

describe(`GET /api/offers/:date`, () => {
  it(`get an offer by date`, async () => {
    const offer = server.offersData[0];

    const response = await request(app).
      get(`/api/offers/${offer.date}`)
      .set(`Accept`, `application/json`)
      .expect(200)
      .expect(`Content-Type`, /json/);

    const reqOffer = response.body;
    assert.deepStrictEqual(reqOffer, offer);
  });

  it(`get an error when offer with date not found`, async () => {
    await request(app).
      get(`/api/offers/123456789`)
      .set(`Accept`, `application/json`)
      .expect(404)
      .expect(`An offer with date: 123456789 not found`)
      .expect(`Content-Type`, /html/);
  });
});

describe(`POST /api/offers`, () => {
  const validOffer = {
    "name": `Моника`,
    "avatar": `keks.png`,
    "preview": `keks.png`,
    "title": `Большая уютная квартира`,
    "address": `570, 472`,
    "description": `Средняя чистая квратира в центре Нью-Йорка. Рядом есть классная кофейня „Central Perk“.`,
    "price": 30000,
    "type": `flat`,
    "rooms": 3,
    "guests": 4,
    "checkin": `12:00`,
    "checkout": `14:00`,
    "features": [`elevator`, `conditioner`]
  };

  const location = {location: {x: 570, y: 472}};

  const validOfferWithoutNotReqiuredData = {
    "title": `Большая уютная квартира`,
    "address": `570, 472`,
    "description": `Средняя чистая квратира в центре Нью-Йорка. Рядом есть классная кофейня „Central Perk“.`,
    "price": 30000,
    "type": `flat`,
    "rooms": 3,
    "guests": 4,
    "checkin": `12:00`,
    "checkout": `14:00`,
    "features": [`elevator`, `conditioner`]
  };

  const notValidOffer = {
    "name": `Моника`,
    "avatar": `test/fixtures/test.pdf`,
    "preview": `test/fixtures/test.pdf`,
    "title": `Средняя квартирка в центре`,
    "address": `570, 472`,
    "description": `Средняя чистая квратира в центре Нью-Йорка. Рядом есть классная кофейня „Central Perk“.`,
    "price": 30000,
    "type": `test`,
    "rooms": `test`,
    "checkin": `09:00`,
    "checkout": `10:00`,
    "features": [`elevator`, `elevator`, `conditioner`]
  };

  it(`post offer`, async () => {
    const response = await request(app)
      .post(`/api/offers`)
      .send(validOffer)
      .set(`Accept`, `application/json`)
      .expect(200)
      .expect(`Content-Type`, /json/);

    const reqOffer = response.body;
    assert.deepStrictEqual(reqOffer, Object.assign({}, validOffer, location));
  });

  it(`post offer with invalid data`, async () => {
    await request(app)
      .post(`/api/offers`)
      .send(notValidOffer)
      .set(`Accept`, `application/json`)
      .expect(400)
      .expect(`Content-Type`, /html/);
  });

  it(`post offer without not reqiured data`, async () => {
    const response = await request(app)
      .post(`/api/offers`)
      .send(validOfferWithoutNotReqiuredData)
      .set(`Accept`, `application/json`)
      .expect(200)
      .expect(`Content-Type`, /json/);

    const reqOffer = response.body;
    assert.strictEqual(NameData.includes(reqOffer.name), true);
  });

  it(`post offer as multipart/form-data`, async () => {
    const response = await request(app)
      .post(`/api/offers`)
      .field(`name`, validOffer.name)
      .attach(`avatar`, `test/fixtures/keks.png`)
      .attach(`preview`, `test/fixtures/keks.png`)
      .field(`title`, validOffer.title)
      .field(`address`, validOffer.address)
      .field(`description`, validOffer.description)
      .field(`price`, validOffer.price)
      .field(`type`, validOffer.type)
      .field(`rooms`, validOffer.rooms)
      .field(`guests`, validOffer.guests)
      .field(`checkin`, validOffer.checkin)
      .field(`checkout`, validOffer.checkout)
      .field(`features`, validOffer.features)
      .set(`Accept`, `application/json`)
      .set(`Content-Type`, `multipart/form-data`)
      .expect(200)
      .expect(`Content-Type`, /json/);

    const reqOffer = response.body;
    assert.deepStrictEqual(reqOffer, Object.assign({}, validOffer, location));
  });

  it(`post offer as multipart/form-data with invalid data`, async () => {
    await request(app)
      .post(`/api/offers`)
      .field(`name`, notValidOffer.name)
      .field(`title`, notValidOffer.title)
      .field(`address`, notValidOffer.address)
      .field(`description`, notValidOffer.description)
      .field(`price`, notValidOffer.price)
      .field(`type`, notValidOffer.type)
      .field(`rooms`, notValidOffer.rooms)
      .field(`checkin`, notValidOffer.checkin)
      .field(`checkout`, notValidOffer.checkout)
      .field(`features`, notValidOffer.features)
      .set(`Accept`, `application/json`)
      .set(`Content-Type`, `multipart/form-data`)
      .expect(400)
      .expect(`Content-Type`, /html/);
  });
});

describe(`Check errors`, () => {
  it(`return 404`, async () => {
    await request(app).
      get(`/api/test`)
      .set(`Accept`, `application/json`)
      .expect(404)
      .expect(`Page was not found`)
      .expect(`Content-Type`, /html/);
  });
});
