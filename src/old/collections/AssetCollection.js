'use strict';

const Collection = require('ampersand-rest-collection');
const SyncPromise = require('./ampersand-rest-collection-promise');

const AssetModel = require('models/AssetModel.js');
const config = require('../../services/Config');

const AssetCollection = Collection.extend({

  /**
   * Reloads the collection.
   * @returns {Promise} the collection has been updated.
   *
   * @memberOf PagedCollection
   * @instance
   */
  updateAll() {
    const fetchOptions = Object.assign({}, this.fetchOptions);

    if (this.lastUpdate) {
      fetchOptions.since = this.lastUpdate;
    }

    return this.fetch({ data: data, remove: false });
  }
});

module.exports = AssetCollection;
