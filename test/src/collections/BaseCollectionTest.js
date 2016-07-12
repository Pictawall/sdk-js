'use strict';

import BaseModel from '../../../src/models/abstract/BaseModel';
import BaseCollection from '../../../src/collections/abstract/PictawallCollection';

const ClassMock = require('../../mock/ClassMock');
const XhrMock = require('../../mock/XhrMock');

class FakeCollection extends BaseCollection {
  constructor(sdk) {
    super(sdk);

    this.apiPath = `/events/${XhrMock.EVENT_ID}/ads`;
  }

  createModel() {
    return new BaseModel(this.sdk);
  }
}

describe('BaseCollection', () => {

  describe('fetch', () => {
    const collection = new FakeCollection(ClassMock.sdk);

    it('populates the collection with the data from the API', () => {
      expect(collection.loaded).toBe(false);
      expect(collection.hasMore).toBe(true);

      const fetchPromise = collection.fetch();
      expect(fetchPromise).toEqual(jasmine.any(Promise));

      fetchPromise.then(_collection => {
        expect(_collection).toBe(collection);
        expect(collection.loaded).toBe(true);
        expect(collection.hasMore).toBe(false);

        const source = XhrMock.AD_COLLECTION.data;
        expect(collection.length).toBe(source.length, 'Collection size does not match source size');

        for (let i = 0; i < source.length; i++) {
          const remoteModel = source[i];
          const localModel = collection.findOne({ id: remoteModel.id });

          expect(localModel).toBeDefined();

          for (let propertyName of Object.getOwnPropertyNames(remoteModel)) {
            expect(localModel.getProperty(propertyName)).toEqual(remoteModel[propertyName]);
          }
        }
      });
    });
  });
});
