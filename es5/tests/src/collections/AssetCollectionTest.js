'use strict';

var AssetCollection = require('../../../src/collections/AssetCollection');
var XhrMock = require('../../mock/XhrMock');
var singletons = require('../singletons');

var ASSET_SOURCE = XhrMock.VALID_EVENT_ASSETS;

describe('AssetCollection', function () {

  /**
   * @type AssetCollection
   */
  var collection = void 0;

  it('can be created', function () {
    collection = new AssetCollection(singletons.event);
  });

  it('loads from the server', function (done) {
    var fetchPromise = collection.fetch();

    expect(fetchPromise).toEqual(jasmine.any(Promise));

    fetchPromise.then(function () {
      expect(collection._since).toBe(ASSET_SOURCE.since);
      expect(collection._total).toBe(ASSET_SOURCE.total);
      expect(collection._currentPage).toBe(ASSET_SOURCE.currentPage);
      expect(collection._pageCount).toBe(ASSET_SOURCE.pageCount);

      done();
    }).catch(function (e) {
      fail(e);
      done();
    });
  });

  it('stores the models', function () {
    expect(collection.length).toBe(ASSET_SOURCE.data.length);

    var localCollection = collection;
    var remoteCollection = ASSET_SOURCE.data;

    for (var i = 0; i < localCollection.length; i++) {
      var remoteModel = remoteCollection[i];
      var localModel = localCollection.findOne({ id: remoteModel.id });

      expect(localModel).toBeDefined();

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;

      var _iteratorError = void 0;

      try {
        for (var _iterator = Object.getOwnPropertyNames(remoteModel)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var propertyName = _step.value;

          expect(localModel.getProperty(propertyName)).toEqual(remoteModel[propertyName]);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  });

  it('can filter favorited assets', function () {
    var favorites = collection.find({ favorited: true }).toArray();

    expect(favorites.length).toBe(1);

    favorites.forEach(function (asset) {
      expect(asset.getProperty('favorited')).toBe(true);
    });
  });

  var eventWithFeatured = void 0;
  describe('hasFeaturedAsset', function () {

    it('returns true if the event has a featured asset', function () {
      expect(collection.hasFeaturedAsset()).toBe(false);
    });

    it('returns false otherwise', function (done) {
      singletons.sdk.getEvent(XhrMock.VALID_IDENTIFIER_FEATURED).then(function (event) {
        expect(event.assetCollection.hasFeaturedAsset()).toBe(true);
        eventWithFeatured = event;
        done();
      }).catch(function (e) {
        fail(e);
        done();
      });
    });
  });

  describe('getFeaturedAsset', function () {

    it('returns true if the event has a featured asset', function () {
      expect(collection.getFeaturedAsset()).toBe(null);
    });

    it('returns false otherwise', function (done) {
      eventWithFeatured.assetCollection.getFeaturedAsset().then(function (asset) {
        expect(asset.getProperty('id')).toBe(eventWithFeatured.getProperty('featuredAssetId'));
        expect(asset.getProperty('featured')).toBe(true);
        done();
      }).catch(function (e) {
        fail(e);
        done();
      });
    });
  });
});