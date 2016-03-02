'use strict';

const AssetCollection = require('../../../src/collections/AssetCollection');
const XhrMock = require('../../mock/XhrMock');

const EventModelTest = require('../models/EventModelTest');

const ASSET_SOURCE = XhrMock.VALID_EVENT_ASSETS;

describe('AssetCollection', () => {

  let collection;

  it('can be created', () => {
    collection = new AssetCollection(null, { event: EventModelTest.event });
  });

  it('loads from the server', done => {
    const loadMorePromise = collection.loadMore();

    expect(loadMorePromise).toEqual(jasmine.any(Promise));

    loadMorePromise
      .then(() => done())
      .catch(e => {
        console.log(e);
        fail(e);
        done();
      });
  });

  it('stores the request metadata', () => {
    expect(collection.lastUpdate).toBe(ASSET_SOURCE.since);
    expect(collection.total).toBe(ASSET_SOURCE.total);
    expect(collection.currentPage).toBe(ASSET_SOURCE.page);
    expect(collection.pageCount).toBe(ASSET_SOURCE.pages);
  });

  it('stores the models', () => {
    expect(collection.length).toBe(ASSET_SOURCE.data.length);

    const localCollection = collection.models;
    const remoteCollection = ASSET_SOURCE.data;

    for (let i = 0; i < localCollection.length; i++) {
      const remoteModel = remoteCollection[i];
      const localModel = localCollection.filter(model => {
        return model.id === remoteModel.id;
      })[0];

      for (let propertyName of Object.getOwnPropertyNames(remoteModel)) {
        if (propertyName === 'event') {
          return;
        }

        expect(localModel[propertyName]).toEqual(remoteModel[propertyName]);
      }
    }
  });
});
