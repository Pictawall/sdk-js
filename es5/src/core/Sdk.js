'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EventModel = require('../models/EventModel');

var _EventModel2 = _interopRequireDefault(_EventModel);

var _ChannelModel = require('../models/ChannelModel');

var _ChannelModel2 = _interopRequireDefault(_ChannelModel);

var _StringUtil = require('../util/StringUtil');

var _StringUtil2 = _interopRequireDefault(_StringUtil);

var _FetchShim = require('./FetchShim');

var _FetchShim2 = _interopRequireDefault(_FetchShim);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

if (typeof require.ensure !== 'function') {
  require.ensure = function (dependencies, callback) {
    callback(require);
  };
}

/**
 * Entry point to the SDK.
 *
 * @class Sdk
 */

var Sdk = function () {

  /**
   * @param {String} [apiBaseUrl = 'https://api.pictawall.com/v2.5'] The pictawall API endpoint.
   */

  function Sdk() {
    var apiBaseUrl = arguments.length <= 0 || arguments[0] === void 0 ? 'https://api.pictawall.com/v2.5' : arguments[0];

    _classCallCheck(this, Sdk);

    this.apiBaseUrl = apiBaseUrl;
  }

  /**
   * Loads the polyfills required to make the SDK work.
   *
   * @returns {!Promise}
   */


  _createClass(Sdk, [{
    key: 'loadPolyfills',
    value: function loadPolyfills() {
      try {
        var polyfillPromises = [];

        // global.fetch
        polyfillPromises.push(_FetchShim2.default.loadFetchPolyfill());

        // Map.toJSON
        if (!Map.prototype.toJSON) {
          polyfillPromises.push(new Promise(function (resolve) {
            require.ensure(['map.prototype.tojson'], function (require) {
              resolve(require('map.prototype.tojson'));
            }, 'Map.toJson-polyfill');
          }));
        }

        // Array.includes
        if (!Array.prototype.includes) {
          polyfillPromises.push(new Promise(function (resolve) {
            require.ensure(['array-includes'], function (require) {
              var includes = require('array-includes');

              includes.shim();

              resolve();
            }, 'Array.includes-polyfill');
          }));
        }

        return Promise.all(polyfillPromises);
      } catch (e) {
        return Promise.reject(e);
      }
    }

    /**
     * Creates and populates a new event model.
     *
     * @param {!String} identifier The identifier of the pictawall event.
     * @param {Object} [config = {}] The config object to give as a third parameter to {@link EventModel#constructor}.
     * @returns {Promise.<EventModel>} A promise which resolves when the model has been populated.
     */

  }, {
    key: 'getEvent',
    value: function getEvent(identifier) {
      var config = arguments.length <= 1 || arguments[1] === void 0 ? {} : arguments[1];

      try {
        var event = new _EventModel2.default(this, identifier, config);
        return event.fetch();
      } catch (e) {
        return Promise.reject(e);
      }
    }

    /**
     * Creates and populates a new channel model.
     *
     * @param {!String} identifier The identifier of the pictawall channel.
     * @returns {Promise.<EventModel>} A promise which resolves when the model has been populated.
     */

  }, {
    key: 'getChannel',
    value: function getChannel(identifier) {
      try {
        var channel = new _ChannelModel2.default(this, identifier);
        return channel.fetch();
      } catch (e) {
        return Promise.reject(e);
      }
    }

    /**
     * Calls an endpoint on the API and returns the response
     *
     * @param {!String} path - The API endpoint. e. g. "/events"
     * @param {Object} [parameters = {}] - The options to give to {@link Global.fetch}.
     * @param {Object} [parameters.pathParameters] - Parameters to insert in the path using {@link StringUtil#format}.
     * @param {Object} [parameters.queryParameters] - List of key -> value parameters to add to the url as query parameters.
     *
     * @return {!Promise.<Response>}
     */

  }, {
    key: 'callApi',
    value: function callApi(path) {
      var parameters = arguments.length <= 1 || arguments[1] === void 0 ? {} : arguments[1];

      path = _StringUtil2.default.format(path, true, parameters.pathParameters);

      if (path.endsWith('/')) {
        path = path.slice(0, -1);
      }

      path += _StringUtil2.default.buildQueryParameters(parameters.queryParameters);

      return _FetchShim2.default.fetch(this.apiBaseUrl + path, parameters);
    }
  }]);

  return Sdk;
}();

exports.default = Sdk;