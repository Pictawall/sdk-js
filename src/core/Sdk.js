'use strict';

import EventModel from '../models/EventModel';
import ChannelModel from '../models/ChannelModel';

import AssetCollection from '../collections/AssetCollection';
import UserCollection from '../collections/UserCollection';
import AdCollection from '../collections/AdCollection';
import MessageCollection from '../collections/MessageCollection';

import StringUtil from '../util/StringUtil';
import FetchShim from './FetchShim';

const QueryString = require('qs-lite');

if (typeof require.ensure !== 'function') {
  require.ensure = function (dependencies, callback) {
    callback(require);
  };
}

/**
 * @private
 */
function _insertCollections(event, collections) {
  if (collections === void 0) {
    event.addCollection('users', new UserCollection(event));
    event.addCollection('assets', new AssetCollection(event));
    event.addCollection('ads', new AdCollection(event));
    event.addCollection('messages', new MessageCollection(event));
  } else {
    for (let collectionName of Object.getOwnPropertyNames(collections)) {
      event.addCollection(collectionName, collections[collectionName](event));
    }
  }
}

/**
 * Entry point to the SDK.
 *
 * @class Sdk
 */
class Sdk {

  /**
   * @param {String} [apiBaseUrl = 'https://api.pictawall.com/v2.5'] The pictawall API endpoint.
   */
  constructor(apiBaseUrl = 'https://api.pictawall.com/v2.5') {
    this.apiBaseUrl = apiBaseUrl;
  }

  /**
   * Loads the polyfills required to make the SDK work.
   *
   * @returns {!Promise}
   */
  loadPolyfills() {
    try {
      const polyfillPromises = [];

      // global.fetch
      polyfillPromises.push(FetchShim.loadFetchPolyfill());

      // Map.toJSON
      if (!Map.prototype.toJSON) {
        polyfillPromises.push(new Promise(resolve => {
          require.ensure(['map.prototype.tojson'], require => {
            resolve(require('map.prototype.tojson'));
          }, 'Map.toJson-polyfill');
        }));
      }

      if (typeof Symbol === 'undefined') {
        polyfillPromises.push(new Promise(resolve => {
          require.ensure(['symbol-polyfill'], require => {
            resolve(require('es6-symbol/implement'));
          });
        }));
      }

      // Array.includes
      if (!Array.prototype.includes) {
        polyfillPromises.push(new Promise(resolve => {
          require.ensure(['array-includes'], require => {
            const includes = require('array-includes');

            includes.shim();

            resolve();
          }, 'Array.includes-polyfill');
        }));
      }

      return Promise.all(polyfillPromises);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /**
   * Creates and populates a new event model.
   *
   * @param {!String} identifier The identifier of the pictawall event.
   * @param {Object} [eventConfig = {}] The config object to give as a third parameter to {@link EventModel#constructor}.
   * @param {Object.<String, Function>} [collections] A list of collections factories to use to create the collections to add to the event and fetch. By default this will create one of each available collections: 'users', 'assets', 'messages', 'ads'.
   * @returns {Promise.<EventModel>} A promise which resolves when the model has been populated.
   *
   * @example
   * sdk.getEvent('undiscovered-london', {}, {
   *  textAssets: event => new AssetCollection(event, { kind: 'text' })
   * });
   */
  getEvent(identifier, eventConfig = {}, collections) {
    try {
      const event = new EventModel(this, identifier, eventConfig);

      _insertCollections(event, collections);

      return event.fetch();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /**
   * <p>Creates and populates a new channel model.</p>
   * <p>The event configuration will be fetched from the API. If you need to have local control over it, you should use {@link Sdk#getEvent} instead.</p>
   *
   * @param {!String} identifier The identifier of the pictawall channel.
   * @returns {Promise.<EventModel>} A promise which resolves when the model has been populated.
   */
  getChannel(identifier) {
    try {
      const channel = new ChannelModel(this, identifier);
      return channel.fetch();
    } catch (e) {
      return Promise.reject(e);
    }
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
  callApi(path, parameters = {}) {
    path = StringUtil.format(path, true, parameters.pathParameters);

    if (path.endsWith('/')) {
      path = path.slice(0, -1);
    }

    const queryString = QueryString.stringify(parameters.queryParameters);
    if (queryString) {
      path += '?' + queryString;
    }

    return FetchShim.fetch(this.apiBaseUrl + path, parameters);
  }
}

export default Sdk;
