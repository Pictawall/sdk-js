'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var config = require('../src/singletons').sdk.config;
var StringUtil = require('../../src/util/StringUtil');
var FakeFetch = require('./FakeFetch');
var FetchShim = require('../../src/core/FetchShim');
var oldFetch = FetchShim.fetch;

function mockRequest(path, pathParams, response) {
  var stubbedPath = new RegExp('^' + config.get('endpoint') + StringUtil.format.apply(StringUtil, [path, false].concat(_toConsumableArray(pathParams))) + '([\\?#].*)?$');

  FakeFetch.mockRoute(stubbedPath, response);
}

module.exports = {
  init: function init() {
    var _this = this;

    FetchShim.fetch = FakeFetch.fetch;

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

    mockRequest('/events/{0}/assets/{1}', [this.VALID_IDENTIFIER_FEATURED, this.VALID_EVENT__FEATURED.data.featuredAssetId], {
      body: JSON.stringify(this.VALID_EVENT_ASSET_FEATURED)
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
    FetchShim.fetch = oldFetch;
  },


  VALID_IDENTIFIER: 'VALID',
  VALID_IDENTIFIER_FEATURED: 'VALID_FEATURED',
  INVALID_IDENTIFIER: 'INVALID',

  VALID_EVENT: require('./event.json'),
  VALID_EVENT__FEATURED: require('./event-with-featured.json'),
  VALID_EVENT_ASSETS: require('./event_assets.json'),
  VALID_EVENT_ASSET_FEATURED: require('./event_asset_featured.json'),
  VALID_EVENT_USERS: require('./event_users.json'),
  VALID_EVENT_ADS: require('./event_ads.json'),
  VALID_EVENT_MESSAGES: require('./event_messages.json')
};