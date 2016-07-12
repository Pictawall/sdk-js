// jscs:disable requireCamelCaseOrUpperCaseIdentifiers

import StringUtil from '../../src/util/StringUtil';
import FetchShim from '../../src/core/fetch';

const sdk = require('./ClassMock').sdk;
const FakeFetch = require('./Xhr/FakeFetch');
const oldFetch = FetchShim.fetch;

function mockRequest(path, response) {
  let queryParameters;
  if (typeof path === 'object') {
    queryParameters = path.query;
    path = path.path;
  }

  response.body = response.body ? JSON.stringify(response.body) : '';

  FakeFetch.mockRoute({ path: sdk.apiBaseUrl + path, queryParameters }, response);
}

module.exports = {
  init() {
    FetchShim.fetch = FakeFetch.fetch;

    const responses200 = [this.EVENT, this.ASSET_COLLECTION, this.USER_COLLECTION, this.AD_COLLECTION, this.MESSAGE_COLLECTION];
    const responses200Featured = [this.EVENT_FEATURED];
    const queryParameters = [
      void 0, {
        page: '1',
        order_by: 'date DESC'
      }, {
        page: '1'
      }
    ];

    ['/events/{0}', '/events/{0}/assets', '/events/{0}/users', '/events/{0}/ads', '/events/{0}/messages']
      .forEach((path, i) => {
        const path200 = StringUtil.format(path, false, this.EVENT_ID);
        const path200Featured = StringUtil.format(path, false, this.EVENT_ID_FEATURED);
        const path404 = StringUtil.format(path, false, this.EVENT_ID_INVALID);

        mockRequest({
          path: path200,
          query: queryParameters[i]
        }, {
          body: responses200[i]
        });

        mockRequest({
          path: path200Featured,
          query: queryParameters[i]
        }, {
          body: responses200Featured[i] || responses200[i]
        });

        mockRequest(path404, { status: 404 });
      });

    // Added assets collection
    mockRequest({
      path: `/events/${this.EVENT_ID}/assets`,
      query: {
        page: '2',
        order_by: 'date DESC',
        since: '1456856265'
      }
    }, {
      body: this.ASSET_COLLECTION_ADDED
    });

    // Deleted assets collection
    mockRequest({
      path: `/events/${this.EVENT_ID}/assets/deleted`,
      query: {
        page: '2',
        order_by: 'date DESC',
        since: '1456856265'
      }
    }, { body: this.ASSET_COLLECTION_DELETED });

    // Single user
    mockRequest(`/events/${this.EVENT_ID_FEATURED}/users/${this.USER.data.id}`, { body: this.USER });

    // featured asset
    mockRequest(`/events/${this.EVENT_ID_FEATURED}/assets/${this.EVENT_FEATURED.data.featuredAssetId}`, { body: this.ASSET_FEATURED });

    // Channel
    mockRequest(`/channels/${this.CHANNEL_ID}`, { body: this.CHANNEL });
  },

  destroy() {
    FetchShim.fetch = oldFetch;
  },

  CHANNEL_ID: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6',
  EVENT_ID: 'VALID',
  EVENT_ID_FEATURED: 'VALID_FEATURED',
  EVENT_ID_INVALID: 'INVALID',

  CHANNEL: require('./Xhr/channels/channel.json'),

  EVENT: require('./Xhr/events/w.o.featured.json'),
  EVENT_FEATURED: require('./Xhr/events/w.featured.json'),

  ASSET_COLLECTION: require('./Xhr/assets/collection_base.json'),
  ASSET_COLLECTION_DELETED: require('./Xhr/assets/collection_deleted.json'),
  ASSET_COLLECTION_ADDED: require('./Xhr/assets/collection_added.json'),
  ASSET_FEATURED: require('./Xhr/assets/single_featured.json'),

  USER: require('./Xhr/users/single.json'),
  USER_COLLECTION: require('./Xhr/users/collection.json'),

  AD_COLLECTION: require('./Xhr/ads/collection.json'),

  MESSAGE_COLLECTION: require('./Xhr/messages/collection.json')
};
