'use strict';

import AssetCollection from '../../../src/collections/AssetCollection';

const XhrMock = require('../../mock/XhrMock');
const ClassMock = require('../../mock/ClassMock');

describe('AssetCollection', () => {

  /**
   * @type AssetCollection
   */
  const collectionWithoutFeatured = ClassMock.build(AssetCollection, XhrMock.EVENT_ID);

  /**
   * @type AssetCollection
   */
  const collectionWithFeatured = ClassMock.build(AssetCollection, XhrMock.EVENT_ID_FEATURED);

  beforeAll(done => {
    Promise.all([
      collectionWithoutFeatured.fetch(),
      collectionWithFeatured.fetch()
    ]).then(() => {
      done();
    }).catch(e => {
      fail(e);
      done(e);
    });

    collectionWithFeatured._event.setProperty('featuredAssetId', 1255548);
    collectionWithoutFeatured._event.setProperty('featuredAssetId', -1);
  });

  it('can filter favorite assets', () => {
    const favorites = collectionWithoutFeatured.find({ favorited: true }).toArray();

    expect(favorites.length).toBe(1);

    favorites.forEach(asset => {
      expect(asset.getProperty('favorited')).toBe(true);
    });
  });

  describe('#update', () => {
    it('synchronises the collection with the remote server', done => {

      expect(true).toBe(true);

      const initialLength = collectionWithoutFeatured.length;
      const removedModels = XhrMock.ASSET_COLLECTION_DELETED.data;
      const addedModels = XhrMock.ASSET_COLLECTION_ADDED.data;

      collectionWithoutFeatured.update().then(result => {
        expect(collectionWithoutFeatured.length).toBe(initialLength - removedModels.length + addedModels.length);
        expect(result).toBe(addedModels.length - removedModels.length);

        removedModels.forEach(id => {
          expect(collectionWithoutFeatured.findOne({ id })).toBeNull();
        });

        addedModels.forEach(model => {
          expect(collectionWithoutFeatured.findOne({ id: model.id })).not.toBeNull();
        });

        done();
      });

    });
  });

  describe('#hasFeaturedAsset', () => {
    it('returns true if the event has a featured asset', () => {
      expect(collectionWithFeatured.hasFeaturedAsset()).toBe(true);
    });

    it('returns false if the event does not have a featured asset', () => {
      expect(collectionWithoutFeatured.hasFeaturedAsset()).toBe(false);
    });
  });

  describe('#getFeaturedAsset', () => {
    it('resolves null if the event does not have a featured asset', done => {
      const fetchPromise = collectionWithoutFeatured.getFeaturedAsset();
      expect(fetchPromise).toEqual(jasmine.any(Promise));

      fetchPromise.then(asset => {
        expect(asset).toBeNull();
        done();
      }).catch(e => {
        fail(e);
        done();
      });
    });

    it('resolves the asset if the event has a featured asset', done => {
      const fetchPromise = collectionWithFeatured.getFeaturedAsset();
      expect(fetchPromise).toEqual(jasmine.any(Promise));

      fetchPromise.then(asset => {
        expect(asset.getProperty('id')).toBe(XhrMock.EVENT_FEATURED.data.featuredAssetId);
        expect(asset.getProperty('featured')).toBe(true);
        done();
      }).catch(e => {
        fail(e);
        done();
      });
    });
  });
});
