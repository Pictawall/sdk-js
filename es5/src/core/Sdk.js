'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EventModel = require('../models/EventModel');

var _EventModel2 = _interopRequireDefault(_EventModel);

var _ChannelModel = require('../models/ChannelModel');

var _ChannelModel2 = _interopRequireDefault(_ChannelModel);

var _AssetCollection = require('../collections/AssetCollection');

var _AssetCollection2 = _interopRequireDefault(_AssetCollection);

var _UserCollection = require('../collections/UserCollection');

var _UserCollection2 = _interopRequireDefault(_UserCollection);

var _AdCollection = require('../collections/AdCollection');

var _AdCollection2 = _interopRequireDefault(_AdCollection);

var _MessageCollection = require('../collections/MessageCollection');

var _MessageCollection2 = _interopRequireDefault(_MessageCollection);

var _StringUtil = require('../util/StringUtil');

var _StringUtil2 = _interopRequireDefault(_StringUtil);

var _FetchShim = require('./FetchShim');

var _FetchShim2 = _interopRequireDefault(_FetchShim);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var QueryString = require('qs-lite');

if (typeof require.ensure !== 'function') {
  require.ensure = function (dependencies, callback) {
    callback(require);
  };
}

/**
 * @private
 */
function _insertCollections(event, collections) {
  if (collections === void 0) {
    event.addCollection('users', new _UserCollection2.default(event));
    event.addCollection('assets', new _AssetCollection2.default(event));
    event.addCollection('ads', new _AdCollection2.default(event));
    event.addCollection('messages', new _MessageCollection2.default(event));
  } else {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;

    var _iteratorError = void 0;

    try {
      for (var _iterator = Object.getOwnPropertyNames(collections)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var collectionName = _step.value;

        event.addCollection(collectionName, collections[collectionName](event));
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

        if (typeof Symbol === 'undefined') {
          polyfillPromises.push(new Promise(function (resolve) {
            require.ensure(['symbol-polyfill'], function (require) {
              resolve(require('es6-symbol/implement'));
            });
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
     * @param {Object} [eventConfig = {}] The config object to give as a third parameter to {@link EventModel#constructor}.
     * @param {Object.<String, Function>} [collections] A list of collections factories to use to create the collections to add to the event and fetch. By default this will create one of each available collections: 'users', 'assets', 'messages', 'ads'.
     * @returns {Promise.<EventModel>} A promise which resolves when the model has been populated.
     *
     * @example
     * sdk.getEvent('undiscovered-london', {}, {
     *  textAssets: event => new AssetCollection(event, { kind: 'text' })
     * });
     */

  }, {
    key: 'getEvent',
    value: function getEvent(identifier) {
      var eventConfig = arguments.length <= 1 || arguments[1] === void 0 ? {} : arguments[1];
      var collections = arguments[2];

      try {
        var event = new _EventModel2.default(this, identifier, eventConfig);

        _insertCollections(event, collections);

        return event.fetch();
      } catch (e) {
        return Promise.reject(e);
      }
    }

    /**
     * <p>Creates and populates a new channel model.</p>
     * <p>The event configuration will be fetched from the API. If you need to have local control over it, you should use {@link Sdk#getEvent} instead.</p>
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

      var queryString = QueryString.stringify(parameters.queryParameters);
      if (queryString) {
        path += '?' + queryString;
      }

      return _FetchShim2.default.fetch(this.apiBaseUrl + path, parameters);
    }
  }]);

  return Sdk;
}();

exports.default = Sdk;