'use strict';

const PagedCollection = require('./PagedCollection');
const AssetModel = require('../models/AssetModel');

// TODO: updateAll

class AssetCollection extends PagedCollection {

  /**
   * @param {!ChannelModel} event The owning event.
   * @param {object} [fetchOptions = {}] Asset fetch options.
   * @param {number} [fetchOptions.limit = 100] How many assets should be returned by each api call.
   * @param {string} [fetchOptions.orderBy = 'date_desc'] Sort order returned by the API. See API Specifications for possible orders.
   * @param {string} [fetchOptions.kind] Defines the kind of assets the API may return. Comma separated values of asset kinds, See API Specifications for mode details.
   */
  constructor(event, { limit = 100, orderBy = 'date_desc', kind } = {}) {
    super(limit, orderBy);

    this._event = event;
    this.setApiPath(`/events/${event.getProperty('identifier')}/assets/{assetId}`);

    this._kindFilter = kind;
  }

  /**
   *
   * @returns {boolean}
   */
  hasFeaturedAsset() {
    return this._event.getProperty('featuredAssetId') !== -1;
  }

  /**
   * <p>Returns a promise containing the featured tweet if any is available. Null otherwise.</p>
   * <p>This method fetches the asset from the server if it does not have it in its local collection.</p>
   * <p>Use {@link #hasFeaturedAsset} to check if this event has a featured asset or not.</p>
   *
   * @returns {Promise.<UserModel>}
   */
  getFeaturedAsset() {
    const assetId = this._event.getProperty('featuredAssetId');

    if (assetId === -1) {
      return null;
    }

    const localResult = this.findOne({ featured: true });
    if (localResult != null) {
      return Promise.resolve(localResult);
    }

    return this.fetch(null, { assetId });
  }

  fetchById(assetId) {
    return this.fetch(null, { assetId }).then(assets => {
      if (assets.length === 1) {
        return assets[0];
      }

      return null;
    });
  }

  /**
   * <p>Returns the list of assets the content manager favorited.</p>
   * <p>Note: This method only filters out non-favorited assets. It does not guarantee to return every favorited
   * asset unless {@link PagedCollection#hasMore} returns false.</p>
   *
   * @returns {Array.<UserModel>}
   */
  getFavorites() {
    return this.find({ favorited: true }).toArray();
  }

  /**
   * Options sent with fetch requests as query parameters.
   *
   * @readonly
   */
  get fetchOptions() {
    const options = super.fetchOptions;

    if (this._kindFilter) {
      options.kind = this._kindFilter;
    }

    return options;
  }

  /**
   * Parses the response from the server and returns the data to use for model creation.
   *
   * @override
   */
  parse(data) {
    data = super.parse(data);

    return data.data;
  }

  /**
   * Creates a model and sets its properties.
   */
  createModel() {
    return new AssetModel(this._event);
  }
}

module.exports = AssetCollection;
