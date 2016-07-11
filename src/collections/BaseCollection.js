'use strict';

import ClassUtil from '../util/ClassUtil';
import { SdkError } from '../core/Errors';
import FetchMixin from '../mixins/FetchMixin';
import FindMixin from '../mixins/FindMixin';
import Sdk from '../core/Sdk';

/**
 * @class BaseCollection
 *
 * @mixes FetchMixin
 * @mixes FindMixin
 * @implements Iterable
 */
class BaseCollection {

  /**
   * @param {!Sdk} sdk
   */
  constructor(sdk) {
    this._loaded = false;

    if (sdk === void 0) {
      throw new SdkError(this, 'This model did not receive a SDK instance.');
    }

    this.sdk = sdk;

    /**
     * @type {Array.<BaseModel>}
     * @private
     */
    this._models = [];
  }

  fetchParser(data) {
    if (data.since) {
      this._lastUpdate = data.since;
    } else {
      this._lastUpdate = Date.now() / 1000; // TODO check if it returns as seconds or ms
    }

    return data;
  }

  /**
   * Creates a model using the {@link #createModel} factory, then sets its properties.
   *
   * @param {!object} modelData Initialisation data for the model.
   * @returns {!BaseModel}
   */
  buildModel(modelData) {
    const model = this.createModel();
    model.setProperties(modelData);

    return model;
  }

  /**
   * Model factory.
   *
   * @return {!BaseModel}
   */
  createModel() {
    throw new SdkError('CreateModel not implemented');
  }

  /**
   * Downloads and populates the collection.
   * @returns {Promise.<this>}
   */
  fetch() {
    if (!this.hasMore) {
      return Sdk.Promise.reject(new SdkError(this, '#fetch called but #hasMore returns false'));
    }

    return this.fetchRaw(this.fetchOptions)
      .then(modelsData => {
        if (!Array.isArray(modelsData)) {
          throw new SdkError(this, `Invalid response from the http API. Should have returned array, got "${JSON.stringify(modelsData)}"`);
        }

        modelsData.forEach(data => {
          this.add(this.buildModel(data), true);
        });

        this._loaded = true;

        return this;
      });
  }

  /**
   * Loads the assets that have been added to the server database after the collection was loaded and removes those deleted.
   * Note: This will make the index jump as it will add data at the front of the collection.
   *
   * @return {!Promise.<>} The model has been updated.
   */
  update() {
    const initialCollectionSize = this.length;

    if (!this.loaded) {
      return this.fetch().then(ignored => this.length - initialCollectionSize);
    }

    const fetchOptions = this.fetchOptions;
    fetchOptions.since = this._lastUpdate;

    const addedItemsPromise = this.fetchRaw(fetchOptions);
    const removedItemsPromise = this.fetchRaw(fetchOptions, 'deleted');

    Promise
      .all([addedItemsPromise, removedItemsPromise])
      .then(([addedItems, removedItems]) => {
        removedItems.forEach(id => this.remove(id));
        addedItems.forEach(item => this.add(item, true, true));
      });
  }

  /**
   * Adds a model to the collection.
   *
   * @param model
   * @param {boolean} [replace = true] If a model with the same ID already exists, overwrite it if true. Ignore the new model if false.
   * @param {boolean} [prepend = false] Insert the model at the beginning of the collection. // TODO auto sort instead like with AssetCollection.sortOrder ?
   *
   * @return {!BaseModel} The model that was actually added (Could be the already existing model if replace is false and the id already exists).
   */
  add(newModel, replace = true, prepend = false) {

    const index = this._loaded ? this._models.findIndex(model => model.id === newModel.id) : -1;

    if (index === -1) {
      if (prepend) {
        this._models.unshift(newModel);
      } else {
        this._models.push(newModel);
      }

      return newModel;
    }

    if (replace) {
      this._models[index] = newModel;
      return newModel;
    } else {
      return this._models[index];
    }
  }

  /**
   * Removes an item based on its identifier.
   * @param modelId - The model identifier.
   * @return {BaseModel} The model that was removed, or null if none was.
   */
  remove(modelId) {
    const index = this._models.findIndex(element => element.id === modelId);

    if (index === -1) {
      return null;
    }

    return this._models.splice(index, 1);
  }

  toJSON() {
    return this._models;
  }

  /**
   * Returns the query parameters to add to a fetch api calls.
   * @returns {Object}
   */
  get fetchOptions() {
    return {};
  }

  /**
   * Returns the size of the collection.
   * @returns {!Number}
   */
  get length() {
    return this._models.length;
  }

  /**
   * Whether or not the collection has been loaded, even partly, or not.
   * @returns {boolean}
   */
  get loaded() {
    return this._loaded;
  }

  /**
   * Whether or not the is data to load from the server using {@link BaseCollection#fetch}.
   * @returns {!boolean}
   */
  get hasMore() {
    return !this._loaded;
  }

  /**
   * <p>Returns the model at the requested position in the collection.</p>
   * <p>Undefined will be returned if the position is out of bounds.</p>
   *
   * @param {!number} pos The position of the model in the collection.
   * @returns {BaseModel}
   */
  at(pos) {
    return this._models[pos];
  }

  *[Symbol.iterator]() {
    for (let i = 0; i < this.length; i++) {
      yield this.at(i);
    }
  }
}

ClassUtil.merge(BaseCollection, FetchMixin, FindMixin);

export default BaseCollection;
