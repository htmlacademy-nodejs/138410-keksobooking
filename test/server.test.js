'use strict';

const request = require(`supertest`);
const assert = require(`assert`);
const Server = require(`../src/server.js`);

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
