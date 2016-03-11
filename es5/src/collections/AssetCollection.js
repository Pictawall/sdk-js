'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === void 0) { var parent = Object.getPrototypeOf(object); if (parent === null) { return void 0; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === void 0) { return void 0; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PagedCollection = require('./PagedCollection');
var AssetModel = require('../models/AssetModel');
var Errors = require('../core/Errors');

// TODO: updateAll

/**
 * Collection os event assets.
 *
 * @extends PagedCollection
 */

var AssetCollection = function (_PagedCollection) {
  _inherits(AssetCollection, _PagedCollection);

  /**
   * @param {!EventModel} event The owning event.
   * @param {object} [fetchOptions = {}] Asset fetch options.
   * @param {number} [fetchOptions.limit = 100] How many assets should be returned by each api call.
   * @param {string} [fetchOptions.orderBy = 'date_desc'] Sort order returned by the API. See API Specifications for possible orders.
   * @param {string} [fetchOptions.kind] Defines the kind of assets the API may return. Comma separated values of asset kinds, See API Specifications for mode details.
   */

  function AssetCollection(event) {
    var _ref = arguments.length <= 1 || arguments[1] === void 0 ? {} : arguments[1];

    var _ref$limit = _ref.limit;
    var limit = _ref$limit === void 0 ? 100 : _ref$limit;
    var _ref$orderBy = _ref.orderBy;
    var orderBy = _ref$orderBy === void 0 ? 'date_desc' : _ref$orderBy;
    var kind = _ref.kind;

    _classCallCheck(this, AssetCollection);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AssetCollection).call(this, event.sdk, limit, orderBy));

    _this._event = event;
    _this.apiPath = '/events/' + event.getProperty('identifier') + '/assets/{assetId}';
    _this.fetchParser = function (response) {
      return response.data;
    };

    _this._kindFilter = kind;
    return _this;
  }

  /**
   * Returns whether or not the event has a featured asset available.
   *
   * @throws SdkError The event hasn't been populated.
   * @returns {boolean}
   */


  _createClass(AssetCollection, [{
    key: 'hasFeaturedAsset',
    value: function hasFeaturedAsset() {
      var assetId = this._event.getProperty('featuredAssetId');

      if (assetId === void 0) {
        throw new Errors.SdkError(this, 'Event.featuredAssetId is undefined, make sure the event has been populated.');
      }

      return assetId !== -1;
    }

    /**
     * <p>Returns a promise containing the featured tweet if any is available.</p>
     * <p>This method fetches the asset from the server if it does not have it in its local collection.</p>
     * <p>Use {@link #hasFeaturedAsset} to check if this event has a featured asset or not.</p>
     *
     * @throws SdkError The event hasn't been populated.
     * @returns {!Promise.<UserModel>}
     */

  }, {
    key: 'getFeaturedAsset',
    value: function getFeaturedAsset() {
      try {
        if (!this.hasFeaturedAsset()) {
          return Promise.resolve(null);
        }

        var localResult = this.findOne({ featured: true });
        if (localResult != null) {
          return Promise.resolve(localResult);
        }

        return this.fetchById(this._event.getProperty('featuredAssetId'));
      } catch (e) {
        return Promise.reject(e);
      }
    }

    /**
     * Retrieves the asset matching the passed ID.
     *
     * @param {number} assetId The ID of the asset to fetch.
     * @returns {!Promise.<AssetModel>}
     */

  }, {
    key: 'fetchById',
    value: function fetchById(assetId) {
      var _this2 = this;

      return this.fetchRaw(null, { assetId: assetId }).then(function (asset) {
        return _this2.buildModel(asset);
      });
    }

    /**
     * Options sent with fetch requests as query parameters.
     *
     * @readonly
     */

  }, {
    key: 'createModel',


    /**
     * Creates a model and sets its properties.
     */
    value: function createModel() {
      return new AssetModel(this._event);
    }
  }, {
    key: 'fetchOptions',
    get: function get() {
      var options = _get(Object.getPrototypeOf(AssetCollection.prototype), 'fetchOptions', this);

      if (this._kindFilter) {
        options.kind = this._kindFilter;
      }

      return options;
    }
  }]);

  return AssetCollection;
}(PagedCollection);

module.exports = AssetCollection;