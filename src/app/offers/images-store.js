'use strict';

const mongodb = require(`mongodb`);
const logger = require(`../../logger`);
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
      catch((e) => logger.error(`Failed to set up the offers collection`, e));

    (async () => {
      const db = await databaseConnect();
      this[bucket] = new mongodb.GridFSBucket(db, {
        chunkSizeBytes: 512 * 1024,
        bucketName: `avatars`
      });
    })();
  }

  async get(filename) {
    const results = await (this[bucket]).find({filename}).toArray();
    const entity = results[0];
    if (!entity) {
      return void 0;
    }
    return {info: entity, stream: this[bucket].openDownloadStreamByName(filename)};
  }

  async save(filename, stream) {
    return new Promise((success, fail) => {
      stream.pipe(this[bucket].openUploadStream(filename)).on(`error`, fail).on(`finish`, success);
    });
  }
}

module.exports = ImagesStore;
