'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Symbols = void 0;

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

var Symbols = exports.Symbols = {
  getUpdatedItems: Symbol('getUpdatedItems')
};

/**
 * @typedef {!Object} BaseCollectionProperties
 * @property {!Array.<BaseModel>} models
 * @property {!boolean} loaded
 * @property {!number} lastUpdate - Unix timestamp of the last collection synchronisation.
 */

/**
 * Private properties
 * @type {WeakMap.<BaseCollection, BaseCollectionProperties>}
 * @private
 */
var instances = new WeakMap();

/**
 * @class BaseCollection
 *
 * @mixes FetchMixin
 * @mixes FindMixin
 * @implements Iterable
 *
 * @property {!Sdk} sdk
 * @property {!function} createModel
 */

var BaseCollection = function () {

  /**
   * @param {!Sdk} sdk
   */
  function BaseCollection(sdk) {
    _classCallCheck(this, BaseCollection);

    if (sdk === void 0) {
      throw new _Errors.SdkError(this, 'This model did not receive a SDK instance.');
    }

    _ClassUtil2.default.defineFinal(this, 'sdk', sdk);
    instances.set(this, {
      lastUpdate: -1,
      loaded: false,
      models: []
    });
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
      instances.get(this).lastUpdate = serverResponse.since || Date.now() / 1000;

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
     * Downloads and populates the collection.
     * @returns {!BaseCollection} this
     */

  }, {
    key: 'fetch',
    value: function fetch() {
      var _this = this;

      var modelsData;
      return regeneratorRuntime.async(function fetch$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (this.hasMore) {
                _context.next = 2;
                break;
              }

              throw new _Errors.SdkError(this, '#fetch called but #hasMore returns false');

            case 2:
              _context.next = 4;
              return regeneratorRuntime.awrap(this.fetchRaw(this.fetchOptions));

            case 4:
              modelsData = _context.sent;

              if (Array.isArray(modelsData)) {
                _context.next = 7;
                break;
              }

              throw new _Errors.SdkError(this, 'Invalid response from the http API. Should have returned array, got "' + JSON.stringify(modelsData) + '"');

            case 7:

              modelsData.forEach(function (data) {
                _this.add(_this.buildModel(data), true);
              });

              instances.get(this).loaded = true;

              return _context.abrupt('return', this);

            case 10:
            case 'end':
              return _context.stop();
          }
        }
      }, null, this);
    }

    /**
     * Loads the assets that have been added to the server database after the collection was loaded and removes those deleted.
     * Note: This will make the index jump as it will add data at the front of the collection.
     *
     * @return {!number} The amount of items added to the collection.
     */

  }, {
    key: 'update',
    value: function update() {
      var _this2 = this;

      var initialCollectionSize, lastUpdate, _ref, added, removed;

      return regeneratorRuntime.async(function update$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              initialCollectionSize = this.length;

              if (this.loaded) {
                _context2.next = 6;
                break;
              }

              _context2.next = 4;
              return regeneratorRuntime.awrap(this.fetch());

            case 4:
              _context2.next = 14;
              break;

            case 6:
              lastUpdate = instances.get(this).lastUpdate;
              _context2.next = 9;
              return regeneratorRuntime.awrap(this[Symbols.getUpdatedItems] ? this[Symbols.getUpdatedItems](lastUpdate) : {});

            case 9:
              _ref = _context2.sent;
              added = _ref.added;
              removed = _ref.removed;


              if (removed) {
                removed.forEach(function (id) {
                  return _this2.remove(id);
                });
              }

              if (added) {
                added.forEach(function (item) {
                  return _this2.add(item, false, true);
                });
              }

            case 14:
              return _context2.abrupt('return', this.length - initialCollectionSize);

            case 15:
            case 'end':
              return _context2.stop();
          }
        }
      }, null, this);
    }

    /**
     * Retrieves the model matching the passed ID.
     *
     * @param {!number} modelId - The ID of the model to fetch.
     * @returns {!BaseModel}
     */

  }, {
    key: 'fetchById',
    value: function fetchById(modelId) {
      var modelData;
      return regeneratorRuntime.async(function fetchById$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return regeneratorRuntime.awrap(this.fetchRaw(null, { modelId: modelId }));

            case 2:
              modelData = _context3.sent;
              return _context3.abrupt('return', this.add(this.buildModel(modelData)));

            case 4:
            case 'end':
              return _context3.stop();
          }
        }
      }, null, this);
    }

    /**
     * Adds a model to the collection.
     *
     * @param model
     * @param {boolean} [replace = true] If a model with the same ID already exists, overwrite it if true. Ignore the new model if false.
     * @param {boolean} [prepend = false] Insert the model at the beginning of the collection. // TODO auto sort with a comparator
     *
     * @return {!BaseModel} The model that was actually added (Could be the already existing model if replace is false and the id already exists).
     */

  }, {
    key: 'add',
    value: function add(newModel) {
      var replace = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
      var prepend = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;


      var properties = instances.get(this);

      var index = properties.loaded ? properties.models.findIndex(function (model) {
        return model.id === newModel.id;
      }) : -1;

      if (index === -1) {
        if (prepend) {
          properties.models.unshift(newModel);
        } else {
          properties.models.push(newModel);
        }

        return newModel;
      }

      if (replace) {
        properties.models[index] = newModel;
        return newModel;
      } else {
        return properties.models[index];
      }
    }

    /**
     * Removes an item based on its identifier.
     * @param modelId - The model identifier.
     * @return {BaseModel} The model that was removed, or null if none was.
     */

  }, {
    key: 'remove',
    value: function remove(modelId) {
      var properties = instances.get(this);

      var index = properties.models.findIndex(function (element) {
        return element.id === modelId;
      });

      if (index === -1) {
        return null;
      }

      return properties.models.splice(index, 1)[0];
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return instances.get(this).models;
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
      return instances.get(this).models[pos];
    }
  }, {
    key: Symbol.iterator,
    value: regeneratorRuntime.mark(function value() {
      var i;
      return regeneratorRuntime.wrap(function value$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              i = 0;

            case 1:
              if (!(i < this.length)) {
                _context4.next = 7;
                break;
              }

              _context4.next = 4;
              return this.at(i);

            case 4:
              i++;
              _context4.next = 1;
              break;

            case 7:
            case 'end':
              return _context4.stop();
          }
        }
      }, value, this);
    })
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
      return instances.get(this).models.length;
    }

    /**
     * Whether or not the collection has been loaded, even partly, or not.
     * @returns {boolean}
     */

  }, {
    key: 'loaded',
    get: function get() {
      return instances.get(this).loaded;
    }

    /**
     * Whether or not the is data to load from the server using {@link BaseCollection#fetch}.
     * @returns {!boolean}
     */

  }, {
    key: 'hasMore',
    get: function get() {
      return !this.loaded;
    }
  }]);

  return BaseCollection;
}();

_ClassUtil2.default.defineAbstract(BaseCollection, 'createModel');
_ClassUtil2.default.merge(BaseCollection, _FetchMixin2.default, _FindMixin2.default);

exports.default = BaseCollection;