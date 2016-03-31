'use strict';

import StringUtil from '../util/StringUtil';
import FetchShim from './FetchShim';

import QueryString from 'qs-lite';

if (typeof require.ensure !== 'function') {
  require.ensure = function (dependencies, callback) {
    callback(require);
  };
}

/**
 * @private
 */
function _insertCollections(event, collections) {
  // load everything at the last minute so polyfills have time to load.
  const AssetCollection = require('../collections/AssetCollection').default;
  const UserCollection = require('../collections/UserCollection').default;
  const AdCollection = require('../collections/AdCollection').default;
  const MessageCollection = require('../collections/MessageCollection').default;

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

function _loadPolyfills() {
  try {
    const polyfillPromises = [];

    // global.fetch
    polyfillPromises.push(FetchShim.loadFetchPolyfill());

    // Symbol
    if (typeof Symbol === 'undefined') {
      polyfillPromises.push(new Promise(resolve => {
        require.ensure(['es6-symbol/implement', 'es5-ext/array/#/@@iterator/implement'], require => {
          resolve([require('es6-symbol/implement'), require('es5-ext/array/#/@@iterator/implement')]);
        }, 'Symbol-polyfill');
      }));
    }

    // Map
    if (!require('es6-map/is-implemented')()) {
      polyfillPromises.push(new Promise(resolve => {
        require.ensure(['es6-map/implement'], require => {
          resolve(require('es6-map/implement'));
        }, 'Map-polyfill');
      }));
    }

    // Map.toJSON
    if (!Map.prototype.toJSON) {
      polyfillPromises.push(new Promise(resolve => {
        require.ensure(['map.prototype.tojson'], require => {
          resolve(require('map.prototype.tojson'));
        }, 'Map.toJson-polyfill');
      }));
    }

    // Array.includes
    if (!Array.prototype.includes) {
      polyfillPromises.push(new Promise(resolve => {
        require.ensure(['array-includes'], require => {
          require('array-includes').shim();

          resolve();
        }, 'Array.includes-polyfill');
      }));
    }

    // Array.findIndex
    if (!Array.prototype.findIndex) {
      polyfillPromises.push(new Promise(resolve => {
        require.ensure(['es5-ext/array/#/find-index/implement'], require => {
          resolve(require('es5-ext/array/#/find-index/implement'));
        }, 'Array.prototype.findIndex-polyfill');
      }));
    }

    // Array.from
    if (!Array.from) {
      polyfillPromises.push(new Promise(resolve => {
        require.ensure(['es5-ext/array/from/implement'], require => {
          resolve(require('es5-ext/array/from/implement'));
        }, 'Array.from-polyfill');
      }));
    }

    // String.endsWith
    if (!String.prototype.endsWith) {
      polyfillPromises.push(new Promise(resolve => {
        require.ensure(['es5-ext/string/#/ends-with/implement'], require => {
          resolve(require('es5-ext/string/#/ends-with/implement'));
        }, 'String.endsWith-polyfill');
      }));
    }

    // Object.is
    if (!Object.is) {
      polyfillPromises.push(new Promise(resolve => {
        require.ensure(['object-is'], require => {
          Object.is = require('object-is');

          resolve();
        }, 'String.endsWith-polyfill');
      }));
    }

    return Promise.all(polyfillPromises);
  } catch (e) {
    return Promise.reject(e);
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

    this.polyfillPromise = _loadPolyfills();
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
      return this.polyfillPromise.then(() => {
        const EventModel = require('../models/EventModel').default;
        const event = new EventModel(this, identifier, eventConfig);

        _insertCollections(event, collections);

        return event.fetch();
      });
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
      return this.polyfillPromise.then(() => {
        const ChannelModel = require('../models/ChannelModel').default;
        const channel = new ChannelModel(this, identifier);
        return channel.fetch();
      });
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
