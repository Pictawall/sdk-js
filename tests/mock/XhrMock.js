'use strict';

require('jasmine-ajax');
const fetchMock = require('./fetchMock');

const StringUtil = require('../../src/util/StringUtil');

const config = require('../src/singletons').sdk.config;
function mockRequest(path, pathParams, response) {
  const stubbedPath = new RegExp('^' + config.get('endpoint') + StringUtil.format(path, ...pathParams) + '([\\?#].*)?$');

  console.log('Stubbing route', stubbedPath.source);

  // whatwg-fetch polyfill fix https://github.com/github/fetch/blob/master/fetch.js#L358
  response.response = response.responseText;

  fetchMock.stubRequest(stubbedPath, response);
  jasmine.Ajax.stubRequest(stubbedPath).andReturn(response);
}

fetchMock.install();
module.exports = {
  init() {
    jasmine.Ajax.install();

    const routes = ['/events/{0}', '/events/{0}/assets', '/events/{0}/users', '/events/{0}/ads', '/events/{0}/messages'];
    const defaultResponses = [this.VALID_EVENT, this.VALID_EVENT_ASSETS, this.VALID_EVENT_USERS, this.VALID_EVENT_ADS, this.VALID_EVENT_MESSAGES];

    function registerValidRoutes(identifier, except = []) {
      routes.forEach((route, index) => {
        if (except.includes(route)) {
          return;
        }

        mockRequest(route, [identifier], {
          status: 200,
          responseText: JSON.stringify(defaultResponses[index])
        });
      });
    }

    // VALID ROUTES
    registerValidRoutes(this.VALID_IDENTIFIER);
    registerValidRoutes(this.VALID_IDENTIFIER_FEATURED, [routes[0]]);

    mockRequest(routes[0], [this.VALID_IDENTIFIER_FEATURED], {
      status: 200,
      responseText: JSON.stringify(this.VALID_EVENT__FEATURED)
    });

    mockRequest('/events/{0}/assets/{1}', [this.VALID_IDENTIFIER_FEATURED, this.VALID_EVENT__FEATURED.data.featuredAssetId], {
      status: 200,
      responseText: JSON.stringify(this.VALID_EVENT_ASSET_FEATURED)
    });

    //1255548

    // INVALID ROUTES
    routes.forEach(route => {
      mockRequest(route, [this.INVALID_IDENTIFIER], {
        status: 404
      });
    });
  },

  destroy() {
    jasmine.Ajax.uninstall();
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
