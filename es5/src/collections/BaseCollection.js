'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ClassUtil = require('../util/ClassUtil');

var _ClassUtil2 = _interopRequireDefault(_ClassUtil);

var _Errors = require('../core/Errors');

var _FetchMixin = require('../mixins/FetchMixin');

var _FetchMixin2 = _interopRequireDefault(_FetchMixin);

var _FindMixin = require('../mixins/FindMixin');

var _FindMixin2 = _interopRequireDefault(_FindMixin);

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
    this._models = [];
  }

  /**
   * Creates a model using the {@link #createModel} factory, then sets its properties.
   *
   * @param {!object} modelData Initialisation data for the model.
   * @returns {!BaseModel}
   */


  _createClass(BaseCollection, [{
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
        return Promise.reject(new _Errors.SdkError(this, '#fetch called but #hasMore returns false'));
      }

      return this.fetchRaw(this.fetchOptions).then(function (modelsData) {
        if (!Array.isArray(modelsData)) {
          throw new _Errors.SdkError(_this2, 'Invalid response from the http API. Should have returned array, got "' + JSON.stringify(modelsData) + '"');
        }

        modelsData.forEach(function (data) {
          _this2.add(_this2.buildModel(data), true, false);
        });

        _this2._loaded = true;

        return _this2;
      });
    }

    /**
     * Adds a model to the collection.
     *
     * @param model
     * @param {boolean} [replace = true] If a model with the same ID already exists, overwrite it if true. Ignore the new model if false.
     * @param {boolean} [persist = true] Currently unused - Persist the model on the server.
     */

  }, {
    key: 'add',
    value: function add(model) {
      var replace = arguments.length <= 1 || arguments[1] === void 0 ? true : arguments[1];
      var persist = arguments.length <= 2 || arguments[2] === void 0 ? true : arguments[2];

      this._models.push(model);
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