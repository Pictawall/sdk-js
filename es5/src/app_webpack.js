'use strict';

/*
 * Webpack entry point
 *
 * - defines the fetch polyfill
 * - exposes most of the bundle
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _app_client = require('./app_client');

var _app_client2 = _interopRequireDefault(_app_client);

var _AdModel = require('./models/AdModel');

var _AdModel2 = _interopRequireDefault(_AdModel);

var _AssetModel = require('./models/AssetModel');

var _AssetModel2 = _interopRequireDefault(_AssetModel);

var _ChannelModel = require('./models/ChannelModel');

var _ChannelModel2 = _interopRequireDefault(_ChannelModel);

var _EventModel = require('./models/EventModel');

var _EventModel2 = _interopRequireDefault(_EventModel);

var _MessageModel = require('./models/MessageModel');

var _MessageModel2 = _interopRequireDefault(_MessageModel);

var _UserModel = require('./models/UserModel');

var _UserModel2 = _interopRequireDefault(_UserModel);

var _AdCollection = require('./collections/AdCollection');

var _AdCollection2 = _interopRequireDefault(_AdCollection);

var _AssetCollection = require('./collections/AssetCollection');

var _AssetCollection2 = _interopRequireDefault(_AssetCollection);

var _MessageCollection = require('./collections/MessageCollection');

var _MessageCollection2 = _interopRequireDefault(_MessageCollection);

var _UserCollection = require('./collections/UserCollection');

var _UserCollection2 = _interopRequireDefault(_UserCollection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  if (window.pictawall === void 0) {
    window.pictawall = {};
  }

  if (window.pictawall.Sdk === void 0) {
    window.pictawall.Sdk = _app_client2.default;
    window.pictawall.Sdk.models = {
      AdModel: _AdModel2.default, AssetModel: _AssetModel2.default, ChannelModel: _ChannelModel2.default, EventModel: _EventModel2.default, MessageModel: _MessageModel2.default, UserModel: _UserModel2.default
    };

    window.pictawall.Sdk.collections = {
      AdCollection: _AdCollection2.default, AssetCollection: _AssetCollection2.default, MessageCollection: _MessageCollection2.default, UserCollection: _UserCollection2.default
    };

    //noinspection JSUnresolvedVariable
    window.pictawall.Sdk.version = PACKAGE_VERSION;
  }

  return window.pictawall.Sdk;
}();