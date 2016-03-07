'use strict';

const AssetCollection = require('../../../src/collections/AssetCollection');
const XhrMock = require('../../mock/XhrMock');
const EventModelTest = require('../models/EventModelTest');

const ASSET_SOURCE = XhrMock.VALID_EVENT_ASSETS;

describe('AssetCollection', () => {

  let collection;

  it('can be created', () => {
    collection = new AssetCollection(EventModelTest.event);
  });

  it('loads from the server', done => {
    const loadMorePromise = collection.loadMore();

    expect(loadMorePromise).toEqual(jasmine.any(Promise));

    loadMorePromise
      .then(() => {
        expect(collection._since).toBe(ASSET_SOURCE.since);
        expect(collection._total).toBe(ASSET_SOURCE.total);
        expect(collection._currentPage).toBe(ASSET_SOURCE.currentPage);
        expect(collection._pageCount).toBe(ASSET_SOURCE.pageCount);

        done();
      })
      .catch(e => {
        fail(e);
        done();
      });
  });

  it('stores the models', () => {
    expect(collection.length).toBe(ASSET_SOURCE.data.length);

    const localCollection = collection;
    const remoteCollection = ASSET_SOURCE.data;

    for (let i = 0; i < localCollection.length; i++) {
      const remoteModel = remoteCollection[i];
      const localModel = localCollection.findOne({ id: remoteModel.id });

      expect(localModel).not.toBeNull();

      for (let propertyName of Object.getOwnPropertyNames(remoteModel)) {
        expect(localModel.getProperty(propertyName)).toEqual(remoteModel[propertyName]);
      }
    }
  });

  it('can filter favorited assets', () => {
    const favorites = collection.find({ favorited: true }).toArray();

    expect(favorites.length).toBe(1);

    favorites.forEach(asset => {
      expect(asset.getProperty('favorited')).toBe(true);
    });
  });
});
