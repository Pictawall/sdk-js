'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ClassUtil = require('../util/ClassUtil');
var SdkError = require('../core/Errors').SdkError;

/**
 * @mixes FetchMixin
 * @mixes FindMixin
 */

var BaseCollection = function () {
  function BaseCollection(sdk) {
    _classCallCheck(this, BaseCollection);

    this._loaded = false;

    if (sdk === void 0) {
      throw new SdkError('This model did not receive a SDK instance.');
    }

    this.sdk = sdk;

    this.reset();
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
     * Model factory
     * @return {!BaseModel}
     */

  }, {
    key: 'createModel',
    value: function createModel() {
      throw new SdkError('CreateModel not implemented');
    }
  }, {
    key: 'hasMore',
    value: function hasMore() {
      return !this._loaded;
    }

    /**
     * Downloads and populates the collection.
     * @returns {Promise.<this>}
     */

  }, {
    key: 'fetch',
    value: function fetch() {
      var _this2 = this;

      return this.fetchRaw(this.fetchOptions).then(function (modelsData) {
        if (!Array.isArray(modelsData)) {
          throw new SdkError(_this2, 'Invalid response from #parse(data). Should have returned array, got "' + JSON.stringify(modelsData) + '"');
        }

        modelsData.forEach(function (data) {
          var model = _this2.createModel(data);
          model.setProperties(data);

          _this2.add(model, true, false);
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
    key: 'reset',
    value: function reset() {
      this._models = [];
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return this._models;
    }
  }, {
    key: 'at',
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
  }, {
    key: 'loaded',
    get: function get() {
      return this._loaded;
    }
  }, {
    key: 'length',
    get: function get() {
      return this._models.length;
    }
  }]);

  return BaseCollection;
}();

var FetchMixin = require('../mixins/FetchMixin');
var FindMixin = require('../mixins/FindMixin');

ClassUtil.merge(BaseCollection, FetchMixin, FindMixin);

module.exports = BaseCollection;