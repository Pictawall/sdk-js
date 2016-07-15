'use strict';

var _AssetCollection = require('../../../src/collections/AssetCollection');

var _AssetCollection2 = _interopRequireDefault(_AssetCollection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var XhrMock = require('../../mock/XhrMock');
var ClassMock = require('../../mock/ClassMock');

describe('AssetCollection', function () {

  /**
   * @type AssetCollection
   */
  var collectionWithoutFeatured = ClassMock.build(_AssetCollection2.default, XhrMock.EVENT_ID);

  /**
   * @type AssetCollection
   */
  var collectionWithFeatured = ClassMock.build(_AssetCollection2.default, XhrMock.EVENT_ID_FEATURED);

  beforeAll(function (done) {
    Promise.all([collectionWithoutFeatured.fetch(), collectionWithFeatured.fetch()]).then(function () {
      done();
    }).catch(function (e) {
      fail(e);
      done(e);
    });

    collectionWithFeatured._event.setProperty('featuredAssetId', 1255548);
    collectionWithoutFeatured._event.setProperty('featuredAssetId', -1);
  });

  it('can filter favorite assets', function () {
    var favorites = collectionWithoutFeatured.find({ favorited: true }).toArray();

    expect(favorites.length).toBe(1);

    favorites.forEach(function (asset) {
      expect(asset.getProperty('favorited')).toBe(true);
    });
  });

  describe('#update', function () {
    it('synchronises the collection with the remote server', function (done) {

      expect(true).toBe(true);

      var initialLength = collectionWithoutFeatured.length;
      var removedModels = XhrMock.ASSET_COLLECTION_DELETED.data;
      var addedModels = XhrMock.ASSET_COLLECTION_ADDED.data;

      collectionWithoutFeatured.update().then(function (result) {
        expect(collectionWithoutFeatured.length).toBe(initialLength - removedModels.length + addedModels.length);
        expect(result).toBe(addedModels.length - removedModels.length);

        removedModels.forEach(function (id) {
          expect(collectionWithoutFeatured.findOne({ id: id })).toBeNull();
        });

        addedModels.forEach(function (model) {
          expect(collectionWithoutFeatured.findOne({ id: model.id })).not.toBeNull();
        });

        done();
      });
    });
  });

  describe('#hasFeaturedAsset', function () {
    it('returns true if the event has a featured asset', function () {
      expect(collectionWithFeatured.hasFeaturedAsset()).toBe(true);
    });

    it('returns false if the event does not have a featured asset', function () {
      expect(collectionWithoutFeatured.hasFeaturedAsset()).toBe(false);
    });
  });

  describe('#getFeaturedAsset', function () {
    it('resolves null if the event does not have a featured asset', function (done) {
      var fetchPromise = collectionWithoutFeatured.getFeaturedAsset();
      expect(fetchPromise).toEqual(jasmine.any(Promise));

      fetchPromise.then(function (asset) {
        expect(asset).toBeNull();
        done();
      }).catch(function (e) {
        fail(e);
        done();
      });
    });

    it('resolves the asset if the event has a featured asset', function (done) {
      var fetchPromise = collectionWithFeatured.getFeaturedAsset();
      expect(fetchPromise).toEqual(jasmine.any(Promise));

      fetchPromise.then(function (asset) {
        expect(asset.getProperty('id')).toBe(XhrMock.EVENT_FEATURED.data.featuredAssetId);
        expect(asset.getProperty('featured')).toBe(true);
        done();
      }).catch(function (e) {
        fail(e);
        done();
      });
    });
  });
});