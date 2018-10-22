'use strict';

const mongodb = require(`mongodb`);
const databaseConnect = require(`../../database/database`);

const bucket = Symbol(`bucket`);

const setupCollection = async () => {
  const db = await databaseConnect();

  const collection = db.collection(`images`);
  collection.createIndex({insertedId: -1}, {unique: true});
  return collection;
};

class ImagesStore {
  constructor() {
    this.collection = setupCollection().
      catch((e) => console.error(`Failed to set up the offers collection`, e));
  }

  async getBucket() {
    if (!this[bucket]) {
      const db = await databaseConnect();
      this[bucket] = new mongodb.GridFSBucket(db, {
        chunkSizeBytes: 512 * 1024,
        bucketName: `avatars`
      });
    }
    return this[bucket];
  }

  async get(filename) {
    const bckt = await this.getBucket();
    const results = await (bckt).find({filename}).toArray();
    const entity = results[0];
    if (!entity) {
      return void 0;
    }
    return {info: entity, stream: bckt.openDownloadStreamByName(filename)};
  }

  async save(filename, stream) {
    const bckt = await this.getBucket();
    return new Promise((success, fail) => {
      stream.pipe(bckt.openUploadStream(filename)).on(`error`, fail).on(`finish`, success);
    });
  }
}

module.exports = ImagesStore;
