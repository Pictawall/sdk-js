'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _StringUtil = require('../util/StringUtil');

var _StringUtil2 = _interopRequireDefault(_StringUtil);

var _FetchShim = require('./FetchShim');

var _FetchShim2 = _interopRequireDefault(_FetchShim);

var _qsLite = require('qs-lite');

var _qsLite2 = _interopRequireDefault(_qsLite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

if (typeof require.ensure !== 'function') {
  require.ensure = function (dependencies, callback) {
    callback(require);
  };
}

/**
 * @private
 */
function _insertCollections(event, collections) {
  // load everything at the last minute so polyfills have time to load.
  var AssetCollection = require('../collections/AssetCollection').default;
  var UserCollection = require('../collections/UserCollection').default;
  var AdCollection = require('../collections/AdCollection').default;
  var MessageCollection = require('../collections/MessageCollection').default;

  if (collections === void 0) {
    event.addCollection('users', new UserCollection(event));
    event.addCollection('assets', new AssetCollection(event));
    event.addCollection('ads', new AdCollection(event));
    event.addCollection('messages', new MessageCollection(event));
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

function _loadPolyfills() {
  try {
    var polyfillPromises = [];

    // global.fetch
    polyfillPromises.push(_FetchShim2.default.loadFetchPolyfill());

    // Symbol
    if (typeof Symbol === 'undefined') {
      polyfillPromises.push(new Promise(function (resolve) {
        require.ensure(['es6-symbol/implement', 'es5-ext/array/#/@@iterator/implement'], function (require) {
          resolve([require('es6-symbol/implement'), require('es5-ext/array/#/@@iterator/implement')]);
        }, 'Symbol-polyfill');
      }));
    }

    // Map
    var mapPromise = new Promise(function (resolve) {
      if (require('es6-map/is-implemented')()) {
        return resolve();
      }

      require.ensure(['es6-map/implement'], function (require) {
        require('es6-map/implement');
        resolve();
      }, 'Map-polyfill');
    });

    polyfillPromises.push(mapPromise);

    // Map.toJSON
    polyfillPromises.push(mapPromise.then(function () {
      return new Promise(function (resolve) {
        if (Map.prototype.toJSON) {
          return resolve();
        }

        require.ensure(['map.prototype.tojson'], function (require) {
          resolve(require('map.prototype.tojson'));
        }, 'Map.toJson-polyfill');
      });
    }));

    // Array.includes
    if (!Array.prototype.includes) {
      polyfillPromises.push(new Promise(function (resolve) {
        require.ensure(['array-includes'], function (require) {
          require('array-includes').shim();

          resolve();
        }, 'Array.includes-polyfill');
      }));
    }

    // Array.findIndex
    if (!Array.prototype.findIndex) {
      polyfillPromises.push(new Promise(function (resolve) {
        require.ensure(['es5-ext/array/#/find-index/implement'], function (require) {
          resolve(require('es5-ext/array/#/find-index/implement'));
        }, 'Array.prototype.findIndex-polyfill');
      }));
    }

    // Array.from
    if (!Array.from) {
      polyfillPromises.push(new Promise(function (resolve) {
        require.ensure(['es5-ext/array/from/implement'], function (require) {
          resolve(require('es5-ext/array/from/implement'));
        }, 'Array.from-polyfill');
      }));
    }

    // String.endsWith
    if (!String.prototype.endsWith) {
      polyfillPromises.push(new Promise(function (resolve) {
        require.ensure(['es5-ext/string/#/ends-with/implement'], function (require) {
          resolve(require('es5-ext/string/#/ends-with/implement'));
        }, 'String.endsWith-polyfill');
      }));
    }

    // Object.is
    if (!Object.is) {
      polyfillPromises.push(new Promise(function (resolve) {
        require.ensure(['object-is'], function (require) {
          Object.is = require('object-is');

          resolve();
        }, 'String.endsWith-polyfill');
      }));
    }

    // WeakMap
    if (typeof WeakMap !== 'function') {
      polyfillPromises.push(new Promise(function (resolve) {
        require.ensure(['es6-weak-map/implement'], function (require) {
          require('es6-weak-map/implement');

          resolve();
        }, 'WeakMap-polyfill');
      }));
    }

    return Promise.all(polyfillPromises);
  } catch (e) {
    return Promise.reject(e);
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

    this.polyfillPromise = _loadPolyfills();
  }

  /**
   * Creates and populates a new event model.
   *
   * @param {!String} identifier The identifier of the pictawall event.
   * @param {Object} [eventConfig = {}] The config object to give as a third parameter to {@link EventModel#constructor}.
   * @param {Object.<String, Function>} [collections = ] A list of collections factories to use to create the collections to add to the event and fetch. By default this will create one of each available collections: 'users', 'assets', 'messages', 'ads'.
   * @returns {Promise.<EventModel>} A promise which resolves when the model has been populated.
   *
   * @example
   * sdk.getEvent('undiscovered-london', {}, {
   *  textAssets: event => new AssetCollection(event, { kind: 'text' })
   * });
   */


  _createClass(Sdk, [{
    key: 'getEvent',
    value: function getEvent(identifier, eventConfig, collections) {
      var _this = this;

      try {
        return this.polyfillPromise.then(function () {
          var EventModel = require('../models/EventModel').default;
          var event = new EventModel(_this, identifier, eventConfig);

          _insertCollections(event, collections);
          return Promise.all([event.fetch(), event.fetchCollections()]).then(function () {
            return event;
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }

    /**
     * <p>Creates and populates a new channel model.</p>
     * <p>The event configuration will be fetched from the API. If you need to have local control over it, you should use {@link Sdk#getEvent} instead.</p>
     *
     * @param {!String} identifier The identifier of the pictawall channel.
     * @param {Object} [eventConfig = {}] The config object to give as a third parameter to {@link EventModel#constructor}.
     * @param {Object.<String, Function>} [collections = ] A list of collections factories to use to create the collections to add to the event and fetch. By default this will create one of each available collections: 'users', 'assets', 'messages', 'ads'.
     * @returns {Promise.<ChannelModel>} A promise which resolves when the model has been populated.
     */

  }, {
    key: 'getChannel',
    value: function getChannel(identifier, eventConfig, collections) {
      var _this2 = this;

      try {
        return this.polyfillPromise.then(function () {
          var ChannelModel = require('../models/ChannelModel').default;
          var channel = new ChannelModel(_this2, identifier, eventConfig);

          return channel.fetch().then(function (channel) {
            _insertCollections(channel.event, collections);
            return channel.event.fetchCollections();
          }).then(function () {
            return channel;
          });
        });
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

      var queryString = _qsLite2.default.stringify(parameters.queryParameters);
      if (queryString) {
        path += '?' + queryString;
      }

      return _FetchShim2.default.fetch(this.apiBaseUrl + path, parameters);
    }
  }]);

  return Sdk;
}();

exports.default = Sdk;