'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _StringUtil = require('../util/StringUtil');

var _StringUtil2 = _interopRequireDefault(_StringUtil);

var _fetch = require('./fetch');

var _fetch2 = _interopRequireDefault(_fetch);

var _URLSearchParams = require('./URLSearchParams');

var _URLSearchParams2 = _interopRequireDefault(_URLSearchParams);

var _polyfills = require('./polyfills');

var _polyfills2 = _interopRequireDefault(_polyfills);

var _Errors = require('./Errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

/**
 * Entry point to the SDK.
 *
 * @class Sdk
 */

var Sdk = function () {

  /**
   * Pictawall endpoint (direct access via https://api.pictawall.com/v2.5)
   * @param {String} [apiBaseUrl = 'https://api.pictawall.net/v2.5'] The pictawall cached API endpoint.
   */
  function Sdk() {
    var apiBaseUrl = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 'https://api.pictawall.net/v2.5';

    _classCallCheck(this, Sdk);

    this.apiBaseUrl = apiBaseUrl;
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

      return (0, _polyfills2.default)().then(function () {
        var EventModel = require('../models/EventModel').default;
        var event = new EventModel(_this, identifier, eventConfig);

        _insertCollections(event, collections);
        return Sdk.Promise.all([event.fetch(), event.fetchCollections()]).then(function () {
          return event;
        });
      });
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

      return (0, _polyfills2.default)().then(function () {
        var ChannelModel = require('../models/ChannelModel').default;
        var channel = new ChannelModel(_this2, identifier, eventConfig);

        return channel.fetch().then(function (channel) {
          _insertCollections(channel.event, collections);
          return channel.event.fetchCollections();
        }).then(function () {
          return channel;
        });
      });
    }

    /**
     * Calls an endpoint on the API and returns the response
     *
     * @param {!String} path - The API endpoint. e. g. "/events"
     * @param {Object} [parameters = {}] - The options to give to {@link Global.fetch}.
     * @param {Object} [parameters.pathParameters = {}] - Parameters to insert in the path using {@link StringUtil#format}.
     * @param {Object} [parameters.queryParameters = {}] - List of key -> value parameters to add to the url as query parameters.
     *
     * @return {!Response}
     */

  }, {
    key: 'callApi',
    value: function callApi(path, parameters) {
      var pathParameters, queryParameters, pathParameterKeys, qsBuilder, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, key, value;

      return regeneratorRuntime.async(function callApi$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              pathParameters = parameters.pathParameters || {};
              queryParameters = parameters.queryParameters || {};


              path = _StringUtil2.default.format(path, true, pathParameters);

              if (path.endsWith('/')) {
                path = path.slice(0, -1);
              }

              pathParameterKeys = Object.getOwnPropertyNames(queryParameters);

              if (!(pathParameterKeys.length > 0)) {
                _context.next = 27;
                break;
              }

              qsBuilder = new _URLSearchParams2.default.URLSearchParams();
              _iteratorNormalCompletion2 = true;
              _didIteratorError2 = false;
              _iteratorError2 = void 0;
              _context.prev = 10;


              for (_iterator2 = pathParameterKeys[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                key = _step2.value;
                value = queryParameters[key];

                qsBuilder.set(key, value);
              }

              _context.next = 18;
              break;

            case 14:
              _context.prev = 14;
              _context.t0 = _context['catch'](10);
              _didIteratorError2 = true;
              _iteratorError2 = _context.t0;

            case 18:
              _context.prev = 18;
              _context.prev = 19;

              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }

            case 21:
              _context.prev = 21;

              if (!_didIteratorError2) {
                _context.next = 24;
                break;
              }

              throw _iteratorError2;

            case 24:
              return _context.finish(21);

            case 25:
              return _context.finish(18);

            case 26:
              path += '?' + qsBuilder.toString();

            case 27:
              _context.prev = 27;
              _context.next = 30;
              return regeneratorRuntime.awrap(_fetch2.default.fetch(this.apiBaseUrl + path, parameters));

            case 30:
              return _context.abrupt('return', _context.sent);

            case 33:
              _context.prev = 33;
              _context.t1 = _context['catch'](27);
              throw new _Errors.NetworkError(this, _context.t1);

            case 36:
            case 'end':
              return _context.stop();
          }
        }
      }, null, this, [[10, 14, 18, 26], [19,, 21, 25], [27, 33]]);
    }

    /**
     * The promise implementation to use inside the SDK, replace this field by your promise implementation.
     * @type {function}
     */

  }], [{
    key: 'Promise',
    get: function get() {
      return Promise;
    }
  }]);

  return Sdk;
}();

exports.default = Sdk;