'use strict';

import StringUtil from '../../src/util/StringUtil';
import FetchShim from '../../src/core/FetchShim';

const sdk = require('./ClassMock').sdk;
const FakeFetch = require('./Xhr/FakeFetch');
const oldFetch = FetchShim.fetch;

function mockRequest(path, pathParams, response) {
  const stubbedPath = new RegExp('^' + sdk.apiBaseUrl + StringUtil.format(path, false, ...pathParams) + '([\\?#].*)?$');

  FakeFetch.mockRoute(stubbedPath, response);
}

module.exports = {
  init() {
    FetchShim.fetch = FakeFetch.fetch;

    const routes = ['/events/{0}', '/events/{0}/assets', '/events/{0}/users', '/events/{0}/ads', '/events/{0}/messages'];
    const defaultResponses = [this.VALID_EVENT, this.VALID_EVENT_ASSETS, this.VALID_EVENT_USERS, this.VALID_EVENT_ADS, this.VALID_EVENT_MESSAGES];

    function registerValidRoutes(identifier, except = []) {
      routes.forEach((route, index) => {
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
    routes.forEach(route => {
      mockRequest(route, [this.INVALID_IDENTIFIER], {
        status: 404
      });
    });
  },

  destroy() {
    FetchShim.fetch = oldFetch;
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
