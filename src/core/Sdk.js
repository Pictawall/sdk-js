'use strict';

const Config = require('./Config');
const EventModel = require('../models/EventModel');
const ChannelModel = require('../models/ChannelModel');

const FetchShim = require('./FetchShim');

if(typeof require.ensure !== 'function') {
  require.ensure = function(dependencies, callback) {
    callback(require);
  };
}

/**
 * Entry point to the SDK.
 */
class Sdk {

  /**
   * @param {string} [apiBaseUrl = 'https://api.pictawall.com/v2.5'] The pictawall API endpoint.
   */
  constructor(apiBaseUrl = 'https://api.pictawall.com/v2.5') {

    /**
     * The SDK instance configuration.
     * @type {!Config}
     */
    this.config = new Config();
    this.config.set('endpoint', apiBaseUrl);
  }

  /**
   * Loads the polyfills required to make the SDK work.
   *
   * @returns {!Promise}
   */
  loadPolyfills() {
    try {
      const polyfillPromises = [];

      polyfillPromises.push(FetchShim.loadFetchPolyfill());

      if (!Map.prototype.toJSON) {
        polyfillPromises.push(new Promise(resolve => {
          require.ensure(['map.prototype.tojson'], require => {
            resolve(require('map.prototype.tojson'));
          }, 'Map.toJson-polyfill');
        }));
      }

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
   * @param {!string} identifier The identifier of the pictawall event.
   * @param {object} [config = {}] The config object to give as a third parameter to {@link EventModel#constructor}.
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
   * @param {!string} identifier The identifier of the pictawall channel.
   * @returns {Promise.<EventModel>} A promise which resolves when the model has been populated.
   */
  getChannel(channelProps) {
    try {
      const channel = new ChannelModel(this, channelProps);
      return channel.fetch();
    } catch (e) {
      return Promise.reject(e);
    }
  }
}

module.exports = Sdk;
