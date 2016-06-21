'use strict';

import StringUtil from '../util/StringUtil';
import FetchShim from './fetch';
import loadPolyfills from './polyfills';

import QueryString from 'qs-lite';

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

/**
 * Entry point to the SDK.
 *
 * @class Sdk
 */
class Sdk {

  /**
   * Pictawall endpoint (direct access via https://api.pictawall.com/v2.5)
   * @param {String} [apiBaseUrl = 'https://api.pictawall.net/v2.5'] The pictawall cached API endpoint.
   */
  constructor(apiBaseUrl = 'https://api.pictawall.net/v2.5') {
    this.apiBaseUrl = apiBaseUrl;
  }

  /**
   * Creates and populates a new event model.
   *
   * @param {!String} identifier The identifier of the pictawall event.
   * @param {Object} [eventConfig = {}] The config object to give as a third parameter to {@link EventModel#constructor}.
   * @param {Object.<String, Function>} [collections = ] A list of collections factories to use to create the collections to add to the event and fetch. By default this will create one of each available collections: 'users', 'assets', 'messages', 'ads'.
   * @returns {Promise.<EventModel>} A promise which resolves when the model has been populated.
   *
   * @example
   * sdk.getEvent('undiscovered-london', {}, {
   *  textAssets: event => new AssetCollection(event, { kind: 'text' })
   * });
   */
  getEvent(identifier, eventConfig, collections) {

    return loadPolyfills().then(() => {
      const EventModel = require('../models/EventModel').default;
      const event = new EventModel(this, identifier, eventConfig);

      _insertCollections(event, collections);
      return Sdk.Promise.all([
        event.fetch(),
        event.fetchCollections()
      ]).then(() => event);
    });
  }

  /**
   * <p>Creates and populates a new channel model.</p>
   * <p>The event configuration will be fetched from the API. If you need to have local control over it, you should use {@link Sdk#getEvent} instead.</p>
   *
   * @param {!String} identifier The identifier of the pictawall channel.
   * @param {Object} [eventConfig = {}] The config object to give as a third parameter to {@link EventModel#constructor}.
   * @param {Object.<String, Function>} [collections = ] A list of collections factories to use to create the collections to add to the event and fetch. By default this will create one of each available collections: 'users', 'assets', 'messages', 'ads'.
   * @returns {Promise.<ChannelModel>} A promise which resolves when the model has been populated.
   */
  getChannel(identifier, eventConfig, collections) {
    return loadPolyfills().then(() => {
      const ChannelModel = require('../models/ChannelModel').default;
      const channel = new ChannelModel(this, identifier, eventConfig);

      return channel.fetch()
        .then(channel => {
          _insertCollections(channel.event, collections);
          return channel.event.fetchCollections();
        })
        .then(() => channel);
    });
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

  /**
   * The promise implementation to use inside the SDK, replace this field by your promise implementation.
   * @type {Promise}
   */
  static get Promise() {
    return Promise;
  }
}

export default Sdk;
