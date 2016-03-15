'use strict';

/*
 * Webpack entry point
 *
 * - defines the fetch polyfill
 * - exposes most of the bundle
 */

import Sdk from './app_client';

import AdModel from './models/AdModel';
import AssetModel from './models/AssetModel';
import ChannelModel from './models/ChannelModel';
import EventModel from './models/EventModel';
import MessageModel from './models/MessageModel';
import UserModel from './models/UserModel';

import AdCollection from './collections/AdCollection';
import AssetCollection from './collections/AssetCollection';
import MessageCollection from './collections/MessageCollection';
import UserCollection from './collections/UserCollection';

export default (function () {
  if (window.pictawall === void 0) {
    window.pictawall = {};
  }

  if (window.pictawall.Sdk === void 0) {
    window.pictawall.Sdk = Sdk;
    window.pictawall.Sdk.models = {
      AdModel, AssetModel, ChannelModel, EventModel, MessageModel, UserModel
    };

    window.pictawall.Sdk.collections = {
      AdCollection, AssetCollection, MessageCollection, UserCollection
    };

    //noinspection JSUnresolvedVariable
    window.pictawall.Sdk.version = PACKAGE_VERSION;
  }

  return window.pictawall.Sdk;
})();
