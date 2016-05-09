'use strict';

import PagedCollection from './PagedCollection';
import AssetModel from '../models/AssetModel';
import Sdk from '../core/Sdk';
import { SdkError } from '../core/Errors';

// TODO: updateAll

/**
 * Collection of event assets.
 *
 * @class AssetCollection
 * @extends PagedCollection
 */
class AssetCollection extends PagedCollection {

  /**
   * @param {!EventModel} event The owning event.
   * @param {object} [fetchOptions = {}] Asset fetch options.
   * @param {number} [fetchOptions.limit = 100] How many assets should be returned by each api call.
   * @param {string} [fetchOptions.orderBy = 'date DESC'] Sort order returned by the API. See API Specifications for possible orders.
   * @param {string} [fetchOptions.kind] Defines the kind of assets the API may return. Comma separated values of asset kinds, See API Specifications for mode details.
   * @param {number} [fetchOptions.since] Filters out assets created before the timestamp this number represents.
   */
  constructor(event, { limit = 100, orderBy = 'date DESC', since, kind } = {}) {
    super(event.sdk, limit, orderBy);

    this._event = event;
    this.apiPath = `/events/${event.getProperty('identifier')}/assets/{assetId}`;
    this.fetchParser = (response => response.data);

    this._sinceFilter = since;
    this._kindFilter = kind;
    this._orderBy = orderBy;
  }

  /**
   * Returns whether or not the event has a featured asset available.
   *
   * @throws SdkError The event hasn't been populated.
   * @returns {boolean}
   */
  hasFeaturedAsset() {
    const assetId = this._event.getProperty('featuredAssetId');

    if (assetId === void 0) {
      throw new SdkError(this, 'Event.featuredAssetId is undefined, make sure the event has been populated.');
    }

    return assetId !== -1;
  }

  /**
   * <p>Returns a promise containing the featured tweet if any is available.</p>
   * <p>This method fetches the asset from the server if it does not have it in its local collection.</p>
   * <p>Use {@link #hasFeaturedAsset} to check if this event has a featured asset or not.</p>
   *
   * @throws SdkError The event hasn't been populated.
   * @returns {!Promise.<UserModel>}
   */
  getFeaturedAsset() {
    try {
      if (!this.hasFeaturedAsset()) {
        return Sdk.Promise.resolve(null);
      }

      const localResult = this.findOne({ featured: true });
      if (localResult != null) {
        return Sdk.Promise.resolve(localResult);
      }

      return this.fetchById(this._event.getProperty('featuredAssetId'));
    } catch (e) {
      return Sdk.Promise.reject(e);
    }
  }

  /**
   * Retrieves the asset matching the passed ID.
   *
   * @param {number} assetId The ID of the asset to fetch.
   * @returns {!Promise.<AssetModel>}
   */
  fetchById(assetId) {
    return this.fetchRaw(null, { assetId }).then(asset => {
      return this.buildModel(asset);
    });
  }

  /**
   * Options sent with fetch requests as query parameters.
   *
   * @readonly
   */
  get fetchOptions() {
    const options = super.fetchOptions;

    if (this._sinceFilter) {
      options.since = this._sinceFilter;
    }

    if (this._kindFilter) {
      options.kind = this._kindFilter;
    }

    if (this._orderBy) {
      options.order_by = this._orderBy;// jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
    }

    return options;
  }

  /**
   * @inheritDoc
   */
  createModel() {
    return new AssetModel(this._event);
  }
}

export default AssetCollection;
