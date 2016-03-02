'use strict';

const AssetCollection = require('../../../src/collections/AssetCollection');
const XhrMock = require('../../mock/XhrMock');

const ASSET_SOURCE = XhrMock.VALID_EVENT_ASSETS;

describe('AssetCollection', () => {

  let collection;

  it('can be created', () => {
    collection = new AssetCollection(null, { eventIdentifier: XhrMock.VALID_IDENTIFIER });
  });

  it('loads from the server', done => {
    const loadMorePromise = collection.loadMore();

    expect(loadMorePromise).toEqual(jasmine.any(Promise));

    loadMorePromise
      .then(() => done())
      .catch(e => {
        fail(e);
        done();
      });
  });

  it('stores the data loaded from the server', () => {
    expect(collection.length).toBe(ASSET_SOURCE.data.length);

    const localCollection = collection.models;
    const remoteCollection = ASSET_SOURCE.data;

    expect(localCollection.since).toBe(remoteCollection.since);
    expect(localCollection.total).toBe(remoteCollection.total);
    expect(localCollection.page).toBe(remoteCollection.page);
    expect(localCollection.pages).toBe(remoteCollection.pages);

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
