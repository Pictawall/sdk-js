'use strict';

const Collection = require('ampersand-rest-collection');
const SyncPromise = require('ampersand-sync-with-promise');

const AssetModel = require('../models/AssetModel.js');
const config = require('../services/Config');

const AssetCollection = Collection.extend({
  model: AssetModel,
  sync: SyncPromise,

  fetchOptions: {},
  currentPage: null,
  pageCount: null,
  lastUpdate: null,
  total: 0,

  /**
   * @classdesc <p>Collection of {@link AssetModel}.</p>
   * <p>The collection inherits from the [ampersand-collection]{@link https://ampersandjs.com/docs/#ampersand-collection} methods.</p>
   *
   * @constructs AssetCollection
   *
   * @param {!String} eventIdentifier - The identifier of the event from which to fetch the assets.
   * @param {!Object} parameters - Constructor parameters.
   * @param {String} [parameters.orderBy = 'date_desc'] Order in which to fetch and sort the assets, values are (likes|likes_asc|date|date_desc).
   * @param {String} [parameters.assetKindFilter] - Restricts the kind of assets to fetch, values are (text|video|image).
   * @param {String} [parameters.url] - Override the url from which the assets will be fetched.
   * @param {number} [parameters.limit] - Sets how many assets are downloaded at once, default value is the one set in the {@link Config} instance.
   */
  initialize(eventIdentifier, { orderBy = 'date_desc', assetKindFilter, url, limit }) {

    this.fetchOptions.order_by = orderBy;// jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
    this.fetchOptions.limit = limit || config.get('limit');
    if (assetKindFilter) {
      this.fetchOptions.kind = assetKindFilter;
    }

    this.url = url || (config.get('endpoint') + '/events/' + eventIdentifier + '/assets');

    this.fetch({ data: this.fetchOptions })
      .then(() => this.trigger('synchronised'))
      .catch(e => this.trigger('synchronise-failed', e));
  },

  setOrder(order) {
    this.fetchOptions.order_by = order;// jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
  },

  /**
   * Called when a new asset page is successfully fetched.
   * Used by ampersand.
   *
   * @memberOf AssetCollection
   * @instance
   * @private
   */
  parse({ page, pages, total, since, data }) {
    if (page > this.currentPage) {
      this.currentPage = page;
    }

    this.pageCount = pages >> 0;
    this.total = total >> 0;
    this.lastUpdate = since;

    return data;
  },

  /**
   * Used by EventModel to auto-update the collection
   * @returns {Promise} the collection has been updated.
   *
   * @memberOf AssetCollection
   * @instance
   */
  updateCollection() {
    const fetchOptions = Object.assign({}, this.fetchOptions);

    if (this.lastUpdate) {
      fetchOptions.since = this.lastUpdate;
    }

    return this.fetch({ data: data, remove: false });
  },

  /**
   * Returns whether or not there is more to be downloaded from the server.
   * @returns {boolean}
   *
   * @memberOf AssetCollection
   * @instance
   */
  hasMore() {
    return this.currentPage < this.pageCount;
  },

  /**
   * Loads the new asset page.
   * @returns {Promise} Promise resolving once the data is loaded.
   *
   * @memberOf AssetCollection
   * @instance
   */
  loadMore() {
    if (!this.hasMore()) {
      return Promise.reject(new Error('Could not fetch, no more data available.'));
    }

    const fetchOptions = Object.assign({}, this.fetchOptions);
    fetchOptions.currentPage = this.currentPage + 1;

    return this.fetch({
      data: fetchOptions,
      remove: false
    });
  },

  /**
   * Used by ampersand to sort the collection.
   *
   * @private
   * @memberOf AssetCollection
   * @instance
   */
  comparator(asset) {
    switch (this.fetchOptions.order_by) {// jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
      case 'likes':
        return [asset.get('likes'), -asset.get('date.date')];
        break;
      case 'likes_asc':
        return [-asset.get('likes'), -asset.get('date.date')];
        break;
      case 'date':
        return -asset.get('when');
        break;
      case 'date_desc':
        return asset.get('when');
        break;
      default:
        return asset.get('display');
        break;
    }
  }

  //getFavorites() {
  //  return this.where({ favorited: true });
  //},
  //
  //getFeatured() {
  //  return this.findWhere({ featured: true });
  //},
  //
  ////TODO sort, filter, exclude (filter)
  //getNextMedium(media = [], where = {}, options = {}) {
  //  let collection = this.clone();
  //  collection.setOrder(this._orderBy);
  //  if (typeof options.order_by !== 'undefined') {
  //    collection.setOrder(options.order_by);
  //  }
  //
  //  collection.set(this.where(where).filter((medium) => {
  //    for (let i in media) {
  //      if (media[i].getId() == medium.getId()) {
  //        return false;
  //      }
  //    }
  //
  //    return true;
  //  }));
  //
  //  collection.sort();
  //
  //  if (collection.length > 0) {
  //    return collection.first();
  //  } else {
  //    if (typeof options.default != 'undefined') {
  //      return options.default;
  //    } else {
  //      return this.findWhere(where);
  //    }
  //  }
  //},
  //
  //getNextMediaByView(medium) {
  //  if (typeof medium != 'undefined' && medium != null) {
  //    var mediumCollection = this.clone();
  //    mediumCollection.set(this.getMediumNot(medium));
  //    mediumCollection.sort();
  //    return mediumCollection.first();
  //  } else {
  //    this.sort();
  //    return this.first();
  //  }
  //},
  //
  //getNextMediaByKindAndView(kind, medium) {
  //  this.sort();
  //  var media = this.where({ kind: kind });
  //
  //  if (typeof medium != 'undefined' && medium != null) {
  //    media = media.filter(function (m) {
  //      return m != medium;
  //    });
  //  }
  //
  //  return _.first(media);
  //},
  //
  //getMediumNot(medium) {
  //  return this.filter((m) => {
  //    return m != medium;
  //  });
  //}
});

module.exports = AssetCollection;
