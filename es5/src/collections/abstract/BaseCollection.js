'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = void 0; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ClassUtil = require('../../util/ClassUtil');

var _ClassUtil2 = _interopRequireDefault(_ClassUtil);

var _Errors = require('../../core/Errors');

var _FetchMixin = require('../../mixins/FetchMixin');

var _FetchMixin2 = _interopRequireDefault(_FetchMixin);

var _FindMixin = require('../../mixins/FindMixin');

var _FindMixin2 = _interopRequireDefault(_FindMixin);

var _Sdk = require('../../core/Sdk');

var _Sdk2 = _interopRequireDefault(_Sdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class BaseCollection
 *
 * @mixes FetchMixin
 * @mixes FindMixin
 * @implements Iterable
 */

var BaseCollection = function () {

  /**
   * @param {!Sdk} sdk
   */

  function BaseCollection(sdk) {
    _classCallCheck(this, BaseCollection);

    this._loaded = false;

    if (sdk === void 0) {
      throw new _Errors.SdkError(this, 'This model did not receive a SDK instance.');
    }

    this.sdk = sdk;

    /**
     * @type {Array.<BaseModel>}
     * @private
     */
    this._models = [];
  }

  /**
   * Parses the data retrieved by {@link FetchMixin#fetchRaw}.
   *
   * @param {!*} serverResponse The data fetched from the server, as an object.
   * @return {!*} The parsed data, to use to populate the model / collection.
   */


  _createClass(BaseCollection, [{
    key: _FetchMixin.Symbols.parseResponse,
    value: function value(serverResponse) {
      if (serverResponse.since) {
        /**
         * Unix timestamp of the last collection synchronisation.
         * @private
         */
        this._lastUpdate = serverResponse.since;
      } else {
        this._lastUpdate = Date.now() / 1000; // requires a unix timestamp
      }

      return serverResponse;
    }

    /**
     * Creates a model using the {@link #createModel} factory, then sets its properties.
     *
     * @param {!object} modelData Initialisation data for the model.
     * @returns {!BaseModel}
     */

  }, {
    key: 'buildModel',
    value: function buildModel(modelData) {
      var model = this.createModel();
      model.setProperties(modelData);

      return model;
    }

    /**
     * Model factory.
     *
     * @return {!BaseModel}
     */

  }, {
    key: 'createModel',
    value: function createModel() {
      throw new _Errors.SdkError('CreateModel not implemented');
    }

    /**
     * Downloads and populates the collection.
     * @returns {Promise.<this>}
     */

  }, {
    key: 'fetch',
    value: function fetch() {
      var _this2 = this;

      if (!this.hasMore) {
        return _Sdk2.default.Promise.reject(new _Errors.SdkError(this, '#fetch called but #hasMore returns false'));
      }

      return this.fetchRaw(this.fetchOptions).then(function (modelsData) {
        if (!Array.isArray(modelsData)) {
          throw new _Errors.SdkError(_this2, 'Invalid response from the http API. Should have returned array, got "' + JSON.stringify(modelsData) + '"');
        }

        modelsData.forEach(function (data) {
          _this2.add(_this2.buildModel(data), true);
        });

        _this2._loaded = true;

        return _this2;
      });
    }

    /**
     * Loads the assets that have been added to the server database after the collection was loaded and removes those deleted.
     * Note: This will make the index jump as it will add data at the front of the collection.
     *
     * @return {!Promise.<>} The model has been updated.
     */

  }, {
    key: 'update',
    value: function update() {
      var _this3 = this;

      var initialCollectionSize = this.length;

      if (!this.loaded) {
        return this.fetch().then(function (ignored) {
          return _this3.length - initialCollectionSize;
        });
      }

      // TODO what happens if it's sorted ?

      var fetchOptions = this.fetchOptions;
      fetchOptions.since = this._lastUpdate;

      var addedItemsPromise = this.fetchRaw(fetchOptions);
      var removedItemsPromise = this.fetchRaw(fetchOptions, { modelId: 'deleted' });

      return Promise.all([addedItemsPromise, removedItemsPromise]).then(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2);

        var addedItems = _ref2[0];
        var removedItems = _ref2[1];

        removedItems.forEach(function (id) {
          return _this3.remove(id);
        });
        addedItems.forEach(function (item) {
          return _this3.add(item, false, true);
        });

        return addedItems.length - removedItems.length;
      });
    }

    /**
     * Adds a model to the collection.
     *
     * @param model
     * @param {boolean} [replace = true] If a model with the same ID already exists, overwrite it if true. Ignore the new model if false.
     * @param {boolean} [prepend = false] Insert the model at the beginning of the collection. // TODO auto sort instead like with AssetCollection.sortOrder ?
     *
     * @return {!BaseModel} The model that was actually added (Could be the already existing model if replace is false and the id already exists).
     */

  }, {
    key: 'add',
    value: function add(newModel) {
      var replace = arguments.length <= 1 || arguments[1] === void 0 ? true : arguments[1];
      var prepend = arguments.length <= 2 || arguments[2] === void 0 ? false : arguments[2];


      var index = this._loaded ? this._models.findIndex(function (model) {
        return model.id === newModel.id;
      }) : -1;

      if (index === -1) {
        if (prepend) {
          this._models.unshift(newModel);
        } else {
          this._models.push(newModel);
        }

        return newModel;
      }

      if (replace) {
        this._models[index] = newModel;
        return newModel;
      } else {
        return this._models[index];
      }
    }

    /**
     * Retrieves the model matching the passed ID.
     *
     * @param {!number} modelId - The ID of the model to fetch.
     * @returns {!Promise.<BaseModel>}
     */

  }, {
    key: 'fetchById',
    value: function fetchById(modelId) {
      var _this4 = this;

      return this.fetchRaw(null, { modelId: modelId }).then(function (modelData) {
        return _this4.add(_this4.buildModel(modelData));
      });
    }

    /**
     * Removes an item based on its identifier.
     * @param modelId - The model identifier.
     * @return {BaseModel} The model that was removed, or null if none was.
     */

  }, {
    key: 'remove',
    value: function remove(modelId) {
      var index = this._models.findIndex(function (element) {
        return element.id === modelId;
      });

      if (index === -1) {
        return null;
      }

      return this._models.splice(index, 1)[0];
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return this._models;
    }

    /**
     * Returns the query parameters to add to a fetch api calls.
     * @returns {Object}
     */

  }, {
    key: 'at',


    /**
     * <p>Returns the model at the requested position in the collection.</p>
     * <p>Undefined will be returned if the position is out of bounds.</p>
     *
     * @param {!number} pos The position of the model in the collection.
     * @returns {BaseModel}
     */
    value: function at(pos) {
      return this._models[pos];
    }

    // *[Symbol.iterator]() {
    //   for (let i = 0; i < this.length; i++) {
    //     yield this.at(i);
    //   }
    // }

  }, {
    key: Symbol.iterator,
    value: function value() {
      var _this = this;

      return {
        next: function next() {
          if (this._index >= _this.length) {
            return { done: true };
          }

          return { done: false, value: _this.at(this._index++) };
        },

        _index: 0
      };
    }
  }, {
    key: 'fetchOptions',
    get: function get() {
      return {};
    }

    /**
     * Returns the size of the collection.
     * @returns {!Number}
     */

  }, {
    key: 'length',
    get: function get() {
      return this._models.length;
    }

    /**
     * Whether or not the collection has been loaded, even partly, or not.
     * @returns {boolean}
     */

  }, {
    key: 'loaded',
    get: function get() {
      return this._loaded;
    }

    /**
     * Whether or not the is data to load from the server using {@link BaseCollection#fetch}.
     * @returns {!boolean}
     */

  }, {
    key: 'hasMore',
    get: function get() {
      return !this._loaded;
    }
  }]);

  return BaseCollection;
}();

_ClassUtil2.default.merge(BaseCollection, _FetchMixin2.default, _FindMixin2.default);

exports.default = BaseCollection;