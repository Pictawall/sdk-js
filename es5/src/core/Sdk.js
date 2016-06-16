'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _StringUtil = require('../util/StringUtil');

var _StringUtil2 = _interopRequireDefault(_StringUtil);

var _fetch = require('./fetch');

var _fetch2 = _interopRequireDefault(_fetch);

var _polyfills = require('./polyfills');

var _polyfills2 = _interopRequireDefault(_polyfills);

var _qsLite = require('qs-lite');

var _qsLite2 = _interopRequireDefault(_qsLite);

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
   * @param {String} [apiBaseUrl = 'https://api.pictawall.com/v2.5'] The pictawall API endpoint.
   */

  function Sdk() {
    var apiBaseUrl = arguments.length <= 0 || arguments[0] === void 0 ? 'https://api.pictawall.com/v2.5' : arguments[0];

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

      return _fetch2.default.fetch(this.apiBaseUrl + path, parameters);
    }

    /**
     * The promise implementation to use inside the SDK, replace this field by your promise implementation.
     * @type {Promise}
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