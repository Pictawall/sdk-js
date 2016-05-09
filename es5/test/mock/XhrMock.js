'use strict';

var _StringUtil = require('../../src/util/StringUtil');

var _StringUtil2 = _interopRequireDefault(_StringUtil);

var _fetch = require('../../src/core/fetch');

var _fetch2 = _interopRequireDefault(_fetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var sdk = require('./ClassMock').sdk;
var FakeFetch = require('./Xhr/FakeFetch');
var oldFetch = _fetch2.default.fetch;

function mockRequest(path, pathParams, response) {
  var stubbedPath = new RegExp('^' + sdk.apiBaseUrl + _StringUtil2.default.format.apply(_StringUtil2.default, [path, false].concat(_toConsumableArray(pathParams))) + '([\\?#].*)?$');

  FakeFetch.mockRoute(stubbedPath, response);
}

module.exports = {
  init: function init() {
    var _this = this;

    _fetch2.default.fetch = FakeFetch.fetch;

    var routes = ['/events/{0}', '/events/{0}/assets', '/events/{0}/users', '/events/{0}/ads', '/events/{0}/messages'];
    var defaultResponses = [this.VALID_EVENT, this.VALID_EVENT_ASSETS, this.VALID_EVENT_USERS, this.VALID_EVENT_ADS, this.VALID_EVENT_MESSAGES];

    function registerValidRoutes(identifier) {
      var except = arguments.length <= 1 || arguments[1] === void 0 ? [] : arguments[1];

      routes.forEach(function (route, index) {
        if (except.includes(route)) {
          return;
        }

        mockRequest(route, [identifier], {
          body: JSON.stringify(defaultResponses[index])
        });
      });
    }

    // VALID ROUTES
    registerValidRoutes(this.VALID_IDENTIFIER);
    registerValidRoutes(this.VALID_IDENTIFIER_FEATURED, [routes[0]]);

    mockRequest(routes[0], [this.VALID_IDENTIFIER_FEATURED], {
      body: JSON.stringify(this.VALID_EVENT__FEATURED)
    });

    mockRequest('/events/{0}/users/{1}', [this.VALID_IDENTIFIER_FEATURED, this.VALID_EVENT_USER.data.id], {
      body: JSON.stringify(this.VALID_EVENT_USER)
    });

    // featured asset
    mockRequest('/events/{0}/assets/{1}', [this.VALID_IDENTIFIER_FEATURED, this.VALID_EVENT__FEATURED.data.featuredAssetId], {
      body: JSON.stringify(this.VALID_EVENT_ASSET_FEATURED)
    });

    mockRequest('/channels/{0}', [this.CHANNEL_ID], {
      body: JSON.stringify(this.CHANNEL)
    });

    //1255548

    // INVALID ROUTES
    routes.forEach(function (route) {
      mockRequest(route, [_this.INVALID_IDENTIFIER], {
        status: 404
      });
    });
  },
  destroy: function destroy() {
    _fetch2.default.fetch = oldFetch;
  },


  CHANNEL_ID: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6',
  VALID_IDENTIFIER: 'VALID',
  VALID_IDENTIFIER_FEATURED: 'VALID_FEATURED',
  INVALID_IDENTIFIER: 'INVALID',

  CHANNEL: require('./Xhr/channel.json'),
  VALID_EVENT: require('./Xhr/event.json'),
  VALID_EVENT__FEATURED: require('./Xhr/event-with-featured.json'),
  VALID_EVENT_ASSETS: require('./Xhr/event_assets.json'),
  VALID_EVENT_ASSET_FEATURED: require('./Xhr/event_asset_featured.json'),
  VALID_EVENT_USER: require('./Xhr/event_user.json'),
  VALID_EVENT_USERS: require('./Xhr/event_users.json'),
  VALID_EVENT_ADS: require('./Xhr/event_ads.json'),
  VALID_EVENT_MESSAGES: require('./Xhr/event_messages.json')
};