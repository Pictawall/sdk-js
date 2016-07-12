'use strict';

import AssetModel from '../models/AssetModel';
import Sdk from '../core/Sdk';
import { SdkError } from '../core/Errors';
import PictawallPagedCollection from './abstract/PictawallPagedCollection';

/**
 * OrderBy value => Asset property mapping.
 */
const SORT_PROPERTIES = {
  display: 'displayCount',
  date: 'postTime',
  likes: 'likeCount'
}; // ['display', 'date', 'likes'];

/**
 * @typedef SortOrder
 * @type Object
 * @property {!string} property - The property of the collection whose values are used to sort.
 * @property {!number} direction - -1 for DESC, 1 for ASC
 */

/**
 * Collection of event assets.
 *
 * @class AssetCollection
 * @extends PictawallPagedCollection
 */
class AssetCollection extends PictawallPagedCollection {

  /**
   * @param {!EventModel} event The owning event.
   * @param {object} [fetchOptions = {}] Asset fetch options.
   * @param {number} [fetchOptions.limit = 100] How many assets should be returned by each api call.
   * @param {string} [fetchOptions.orderBy = 'date DESC'] Sort order returned by the API. See API Specifications for possible orders.
   * @param {string} [fetchOptions.kind] Defines the kind of assets the API may return. Comma separated values of asset kinds, See API Specifications for mode details.
   */
  constructor(event, { limit = 100, orderBy = 'date DESC', kind } = {}) {
    super(event.sdk, limit, orderBy);

    this._event = event;
    this.apiPath = `/events/${event.getProperty('identifier')}/assets/{modelId}`;

    this._kindFilter = kind;
    this._orderBy = orderBy;

    if (!/^[a-z]+[_ ](asc|desc)$/i.test(this._orderBy)) {
      throw new SdkError(this, `orderBy value "${this._orderBy}" does not match the parameter requirements (/^[a-z]+[_ ](asc|desc)$/i)`);
    }

    if (!this.sortOrder.property) {
      throw new SdkError(this, `orderBy property should be one of "${Object.keys(SORT_PROPERTIES).join('", "')}".`);
    }
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

  // /**
  //  * Load the assets that have been added to the server database after the collection was loaded.
  //  * Note: This will make the index jump as it will add data at the front of the collection.
  //  *
  //  * @return {!Promise.<number>} The amount of models added to the collection.
  //  */
  // update() {
  //   const initialCollectionSize = this.length;
  //
  //   if (!this._sinceValue) {
  //     return this.fetch().then(ignored => this.length - initialCollectionSize);
  //   }
  //
  //   // TODO bit hacky, could be better
  //   this._sinceFilter = this._sinceValue;
  //   const promise = this.fetch();
  //   this._sinceFilter = null;
  //
  //   return promise.then(ignored => {
  //     const sortOrder = this.sortOrder;
  //
  //     this._models.sort(function (a, b) {
  //       const propertyA = a.getProperty(sortOrder.property);
  //       const propertyB = b.getProperty(sortOrder.property);
  //
  //       if (propertyA === propertyB) {
  //         return 0;
  //       }
  //
  //       if (propertyA > propertyB) {
  //         return sortOrder.direction;
  //       }
  //
  //       return -sortOrder.direction;
  //     });
  //
  //     return this.length - initialCollectionSize;
  //   });
  // }

  /**
   * Returns the sort order.
   *
   * @returns {!SortOrder}
   */
  get sortOrder() {
    const [property, direction] = this._orderBy.toLowerCase().split(/[_ ]/);

    //noinspection JSValidateTypes
    return { property: SORT_PROPERTIES[property], direction: direction === 'asc' ? 1 : -1 };
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
   * @inheritDoc
   */
  get fetchOptions() {
    const options = super.fetchOptions;

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
