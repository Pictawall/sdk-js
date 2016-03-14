'use strict';

import EventModel from '../models/EventModel';
import ChannelModel from '../models/ChannelModel';

import StringUtil from '../util/StringUtil';
import FetchShim from './FetchShim';

const QueryString = require('qs-lite');

if (typeof require.ensure !== 'function') {
  require.ensure = function (dependencies, callback) {
    callback(require);
  };
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
   * @param {Object} [config = {}] The config object to give as a third parameter to {@link EventModel#constructor}.
   * @returns {Promise.<EventModel>} A promise which resolves when the model has been populated.
   */
  getEvent(identifier, config = {}) {
    try {
      const event = new EventModel(this, identifier, config);
      return event.fetch();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /**
   * Creates and populates a new channel model.
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
