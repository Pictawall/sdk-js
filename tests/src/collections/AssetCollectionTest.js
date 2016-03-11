'use strict';

const AssetCollection = require('../../../src/collections/AssetCollection');
const XhrMock = require('../../mock/XhrMock');
const ClassMock = require('../../mock/ClassMock');

const ASSET_SOURCE = XhrMock.VALID_EVENT_ASSETS;

describe('AssetCollection', () => {

  /**
   * @type AssetCollection
   */
  const collectionWithoutFeatured = ClassMock.build(AssetCollection, XhrMock.VALID_IDENTIFIER);

  /**
   * @type AssetCollection
   */
  const collectionWithFeatured = ClassMock.build(AssetCollection, XhrMock.VALID_IDENTIFIER_FEATURED);

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
        expect(asset.getProperty('id')).toBe(XhrMock.VALID_EVENT__FEATURED.data.featuredAssetId);
        expect(asset.getProperty('featured')).toBe(true);
        done();
      }).catch(e => {
        fail(e);
        done();
      });
    });
  });
});
