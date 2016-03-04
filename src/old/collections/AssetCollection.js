'use strict';

const Collection = require('ampersand-rest-collection');
const SyncPromise = require('./ampersand-rest-collection-promise');

const AssetModel = require('models/AssetModel.js');
const config = require('../../services/Config');

const AssetCollection = Collection.extend({
  model: AssetModel,
  fetch: SyncPromise.fetch,

  fetchOptions: {},
  currentPage: 0,
  pageCount: 1,
  lastUpdate: null,
  total: 0,

  /**
   * @classdesc <p>Collection of {@link UserModel}.</p>
   * <p>The collection inherits from the [ampersand-collection]{@link https://ampersandjs.com/docs/#ampersand-collection} methods.</p>
   *
   * @constructs AssetCollection
   *
   * @param {Object[]} defaultAssets - From ampersand, set to a falsy value or pass an array of objects containing the parameters to give to the {@link UserModel} constructor.
   * @param {!Object} parameters - Constructor parameters.
   * @param {!EventModel} [event] - The event for which to fetch the assets.
   * @param {String} [parameters.orderBy = 'date_desc'] Order in which to fetch and sort the assets, values are (likes|likes_asc|date|date_desc).
   * @param {String} [parameters.assetKindFilter] - Restricts the kind of assets to fetch, values are (text|video|image).
   * @param {String} [parameters.url] - Override the url from which the assets will be fetched.
   * @param {number} [parameters.limit] - Sets how many assets are downloaded at once, default value is the one set in the {@link Config} instance.
   */
  initialize(defaultAssets, { event, orderBy = 'date_desc', assetKindFilter, url, limit } = {}) {
    if (!event) {
      throw new Error('Event is not set');
    }

    this.fetchOptions.order_by = orderBy;// jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
    this.fetchOptions.limit = limit || config.get('limit');
    if (assetKindFilter) {
      this.fetchOptions.kind = assetKindFilter;
    }

    this.url = url || (config.get('endpoint') + '/events/' + event.identifier + '/assets');
  },

  setOrder(order) {
    this.fetchOptions.order_by = order;// jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
  },

  /**
   * Called when a new asset page is successfully fetched.
   * Used by ampersand.
   *
   * @memberOf PagedCollection
   * @instance
   * @private
   */
  parse({ page, pages, total, since, data }) {
    if (page > this.currentPage) {
      this.currentPage = page;
    }

    this.pageCount = pages;
    this.total = total;
    this.lastUpdate = since;

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
    const fetchOptions = Object.assign({}, this.fetchOptions);

    if (this.lastUpdate) {
      fetchOptions.since = this.lastUpdate;
    }

    return this.fetch({ data: data, remove: false });
  },

  /**
   * Used by ampersand to sort the collection.
   *
   * @private
   * @memberOf PagedCollection
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
  },

  /**
   * <p>Returns the list of assets the content manager favorited.</p>
   * <p>Note: This method only filters out non-favorited assets. It does not guarantee to return every favorited
   * asset unless {@link PagedCollection#hasMore} returns false.</p>
   *
   * @returns {Array.<UserModel>}
   */
  getFavorites() {
    return this.models.filter(model => model.favorited);
  },

  /**
   * Returns the featured tweet if any is available, null otherwise.
   * @returns {UserModel}
   */
  getFeatured() {
    // if not in collection, getById
    // id is in EventModel
  }

  // TODO replace by
  // let filter = Object.assign({ id: { '$in': excludedAssets } }, whereFilter);
  // this.find(filter).orderBy(orderBy).first();
  //findFirst({ excludedAssets = [], whereFilter = {}, orderBy = this.fetchOptions.order_by, defaultAsset } = {}) {// jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
  //  const excludedAssetIds = excludedAssets.map(asset => {
  //    return asset.id;
  //  });
  //
  //  const collection = this.clone();
  //  collection.set(this.where(whereFilter).filter(asset => {
  //    return !excludedAssetIds.includes(asset.id);
  //  }));
  //
  //  collection.setOrder(orderBy);
  //  collection.sort();
  //
  //  if (collection.length > 0) {
  //    return collection.first();
  //  } else if (defaultAsset !== void 0) {
  //    return defaultAsset;
  //  } else {
  //    return this.findWhere(where);
  //  }
  //}
});

module.exports = AssetCollection;
