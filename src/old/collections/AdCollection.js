'use strict';

const Collection = require('ampersand-rest-collection');
const SyncPromise = require('./ampersand-rest-collection-promise');

const AdModel = require('models/AdModel');
const config = require('../../services/Config');

const AssetCollection = Collection.extend({
  model: AdModel,
  fetch: SyncPromise.fetch,

  initialize(defaultModels, { event, url } = {}) {
    if (!event) {
      throw new Error('Event is not set');
    }

    this.url = url || (config.get('endpoint') + '/events/' + event.identifier + '/ads');
  },

  parse({ data }) {
    return data;
  },

  /**
   * Reloads the collection.
   * @returns {Promise} the collection has been updated.
   *
   * @memberOf PagedCollection
   * @instance
   */
  updateAll() {
    return this.fetch({ remove: false });
  }
});

module.exports = AssetCollection;
