'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventModel = require('../models/EventModel');
var ChannelModel = require('../models/ChannelModel');
var StringUtil = require('../util/StringUtil');

var FetchShim = require('./FetchShim');

if (typeof require.ensure !== 'function') {
  require.ensure = function (dependencies, callback) {
    callback(require);
  };
}

/**
 * Entry point to the SDK.
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

        polyfillPromises.push(FetchShim.loadFetchPolyfill());

        if (!Map.prototype.toJSON) {
          polyfillPromises.push(new Promise(function (resolve) {
            require.ensure(['map.prototype.tojson'], function (require) {
              resolve(require('map.prototype.tojson'));
            }, 'Map.toJson-polyfill');
          }));
        }

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
        var event = new EventModel(this, identifier, config);
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
        var channel = new ChannelModel(this, identifier);
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

      path = StringUtil.format(path, true, parameters.pathParameters);

      if (path.endsWith('/')) {
        path = path.slice(0, -1);
      }

      path += StringUtil.buildQueryParameters(parameters.queryParameters);

      return FetchShim.fetch(this.apiBaseUrl + path, parameters);
    }
  }]);

  return Sdk;
}();

module.exports = Sdk;