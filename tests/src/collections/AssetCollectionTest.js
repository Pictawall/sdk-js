'use strict';

const AssetCollection = require('../../../src/collections/AssetCollection');
const XhrMock = require('../../mock/XhrMock');
const EventModelTest = require('../models/EventModelTest');

const EventModel = require('../../../src/models/EventModel');

const ASSET_SOURCE = XhrMock.VALID_EVENT_ASSETS;

describe('AssetCollection', () => {

  /**
   * @type AssetCollection
   */
  let collection;

  it('can be created', () => {
    collection = new AssetCollection(EventModelTest.event);
  });

  it('loads from the server', done => {
    const fetchPromise = collection.fetch();

    expect(fetchPromise).toEqual(jasmine.any(Promise));

    fetchPromise
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

      expect(localModel).toBeDefined();

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

  let eventWithFeatured;
  describe('hasFeaturedAsset', () => {

    it('returns true if the event has a featured asset', () => {
      expect(collection.hasFeaturedAsset()).toBe(false);
    });

    it('returns false otherwise', done => {
      EventModel.loadEvent(XhrMock.VALID_IDENTIFIER_FEATURED).then(event => {
        expect(event.assetCollection.hasFeaturedAsset()).toBe(true);
        eventWithFeatured = event;
        done();
      }).catch(e => {
        fail(e);
        done();
      });
    });
  });

  describe('getFeaturedAsset', () => {

    it('returns true if the event has a featured asset', () => {
      expect(collection.getFeaturedAsset()).toBe(null);
    });

    it('returns false otherwise', done => {
      eventWithFeatured.assetCollection.getFeaturedAsset().then(asset => {
        expect(asset.getProperty('id')).toBe(eventWithFeatured.getProperty('featuredAssetId'));
        expect(asset.getProperty('featured')).toBe(true);
        done();
      }).catch(e => {
        fail(e);
        done();
      });
    });
  });
});
