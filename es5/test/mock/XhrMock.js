'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; // jscs:disable requireCamelCaseOrUpperCaseIdentifiers

var _StringUtil = require('../../src/util/StringUtil');

var _StringUtil2 = _interopRequireDefault(_StringUtil);

var _fetch = require('../../src/core/fetch');

var _fetch2 = _interopRequireDefault(_fetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sdk = require('./ClassMock').sdk;
var FakeFetch = require('./Xhr/FakeFetch');
var oldFetch = _fetch2.default.fetch;

function mockRequest(path, response) {
  var queryParameters = void 0;
  if ((typeof path === 'undefined' ? 'undefined' : _typeof(path)) === 'object') {
    queryParameters = path.query;
    path = path.path;
  }

  response.body = response.body ? JSON.stringify(response.body) : '';

  FakeFetch.mockRoute({ path: sdk.apiBaseUrl + path, queryParameters: queryParameters }, response);
}

module.exports = {
  init: function init() {
    var _this = this;

    _fetch2.default.fetch = FakeFetch.fetch;

    var responses200 = [this.EVENT, this.ASSET_COLLECTION, this.USER_COLLECTION, this.AD_COLLECTION, this.MESSAGE_COLLECTION];
    var responses200Featured = [this.EVENT_FEATURED];
    var queryParameters = [void 0, {
      page: '1',
      order_by: 'date DESC'
    }, {
      page: '1'
    }];

    ['/events/{0}', '/events/{0}/assets', '/events/{0}/users', '/events/{0}/ads', '/events/{0}/messages'].forEach(function (path, i) {
      var path200 = _StringUtil2.default.format(path, false, _this.EVENT_ID);
      var path200Featured = _StringUtil2.default.format(path, false, _this.EVENT_ID_FEATURED);
      var path404 = _StringUtil2.default.format(path, false, _this.EVENT_ID_INVALID);

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
      path: '/events/' + this.EVENT_ID + '/assets',
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
      path: '/events/' + this.EVENT_ID + '/assets/deleted',
      query: {
        page: '2',
        order_by: 'date DESC',
        since: '1456856265'
      }
    }, { body: this.ASSET_COLLECTION_DELETED });

    // Single user
    mockRequest('/events/' + this.EVENT_ID_FEATURED + '/users/' + this.USER.data.id, { body: this.USER });

    // featured asset
    mockRequest('/events/' + this.EVENT_ID_FEATURED + '/assets/' + this.EVENT_FEATURED.data.featuredAssetId, { body: this.ASSET_FEATURED });

    // Channel
    mockRequest('/channels/' + this.CHANNEL_ID, { body: this.CHANNEL });
  },
  destroy: function destroy() {
    _fetch2.default.fetch = oldFetch;
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