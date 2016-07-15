'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _FetchMixin = require('../../mixins/FetchMixin');

var _FetchMixin2 = _interopRequireDefault(_FetchMixin);

var _ClassUtil = require('../../util/ClassUtil');

var _ClassUtil2 = _interopRequireDefault(_ClassUtil);

var _Errors = require('../../core/Errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Maps containing the properties of the models.
 * @type {WeakMap.<BaseModel, Map>}
 * @private
 */
var _propertyMaps = new WeakMap();

/**
 * <p>Default model, can fetch from the api and store the data.</p>
 * <p>Extend to add model-specific functionality.</p>
 *
 * @class BaseModel
 * @mixes FetchMixin
 */

var BaseModel = function () {

  /**
   * @param {!Sdk} sdk The SDK in which this model is running.
   */

  function BaseModel(sdk) {
    _classCallCheck(this, BaseModel);

    _propertyMaps.set(this, new Map());

    /**
     * The instance of the SDK that created this model.
     * @type {!Sdk}
     * @readonly
     */
    this.sdk = sdk;
  }

  /**
   * Initializes the properties of the model.
   *
   * @param {!object} newProperties The set of properties to put in the model. Pre-existing ones will be overwritten.
   * @returns {!BaseModel} this.
   */


  _createClass(BaseModel, [{
    key: 'setProperties',
    value: function setProperties(newProperties) {
      if ((typeof newProperties === 'undefined' ? 'undefined' : _typeof(newProperties)) !== 'object') {
        throw new _Errors.SdkError(this, 'Invalid newProperties value "' + newProperties + '". This might be due to the server returning an invalid value, you can modify it using a fetch parser.');
      }

      var propertyMap = _propertyMaps.get(this);
      propertyMap.clear();

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;

      var _iteratorError = void 0;

      try {
        for (var _iterator = Object.getOwnPropertyNames(newProperties)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var propertyName = _step.value;

          var property = newProperties[propertyName];

          propertyMap.set(propertyName, property);
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

      return this;
    }

    /**
     * Sets a property of the model.
     *
     * @param {!string} propertyName The name of the property to set.
     * @param {!*} propertyValue The value to set the property to.
     *
     * @return {!BaseModel} this.
     */

  }, {
    key: 'setProperty',
    value: function setProperty(propertyName, propertyValue) {
      _propertyMaps.get(this).set(propertyName, propertyValue);
      return this;
    }

    /**
     * Returns the value of a property or undefined if such property does not exist.
     *
     * @param {!string} propertyName The name of the property to retrieve.
     * @returns {*}
     */

  }, {
    key: 'getProperty',
    value: function getProperty(propertyName) {
      return _propertyMaps.get(this).get(propertyName);
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return _propertyMaps.get(this).toJSON();
    }

    /**
     * Retrieves the model's properties from the API.
     *
     * @param {object} [queryParameters] Query parameters to add the the HTTP request.
     * @returns {Promise.<BaseModel>} A promise that resolves this once the properties have been set.
     */

  }, {
    key: 'fetch',
    value: function fetch(queryParameters) {
      var _this = this;

      return this.fetchRaw(queryParameters).then(function (data) {
        _this.setProperties(data);
        return _this;
      });
    }

    /**
     * Returns the type of model as a string.
     *
     * @returns {!String}
     */

  }, {
    key: 'type',
    get: function get() {
      throw new _Errors.SdkError(this, 'get type() not implemented');
    }

    /**
     * Returns the identifier of the model.
     * @returns {*}
     */

  }, {
    key: 'id',
    get: function get() {
      throw new _Errors.SdkError(this, 'get id() not implemented');
    }
  }]);

  return BaseModel;
}();

_ClassUtil2.default.merge(BaseModel, _FetchMixin2.default);

exports.default = BaseModel;