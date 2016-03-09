'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FetchMixin = require('../mixins/FetchMixin');
var ClassUtil = require('../util/ClassUtil');
var SdkError = require('../core/Errors').SdkError;

/**
 * @mixes FetchMixin
 */

var BaseModel = function () {

  /**
   * @param {!Sdk} sdk The SDK in which this model is running.
   */

  function BaseModel(sdk) {
    _classCallCheck(this, BaseModel);

    /**
     * Model properties, data returned by the server.
     * @type {JsonableMap}
     */
    this._properties = new Map();

    /**
     * The owning SDK.
     * @type {!Sdk}
     */
    this.sdk = sdk;
  }

  _createClass(BaseModel, [{
    key: 'setProperties',
    value: function setProperties(newProperties) {
      if ((typeof newProperties === 'undefined' ? 'undefined' : _typeof(newProperties)) !== 'object') {
        throw new SdkError(this, 'Invalid newProperties value "' + newProperties + '". This is the value returned by #parse(data).');
      }

      this._properties.clear();

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;

      var _iteratorError = void 0;

      try {
        for (var _iterator = Object.getOwnPropertyNames(newProperties)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var propertyName = _step.value;

          var property = newProperties[propertyName];

          this._properties.set(propertyName, property);
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
  }, {
    key: 'setProperty',
    value: function setProperty(propertyName, propertyValue) {
      this._properties.set(propertyName, propertyValue);
    }
  }, {
    key: 'getProperty',
    value: function getProperty(propName) {
      return this._properties.get(propName);
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return this._properties.toJSON();
    }
  }, {
    key: 'fetch',
    value: function fetch(queryParameters) {
      var _this = this;

      return this.fetchRaw(queryParameters).then(function (data) {
        _this.setProperties(data);
        return _this;
      });
    }
  }]);

  return BaseModel;
}();

ClassUtil.merge(BaseModel, FetchMixin);

module.exports = BaseModel;