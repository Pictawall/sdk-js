'use strict';

import ClassUtil from '../util/ClassUtil';
import { SdkError } from '../core/Errors';
import FetchMixin from '../mixins/FetchMixin';
import FindMixin from '../mixins/FindMixin';

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
    this._models = [];
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
      return Promise.reject(new SdkError(this, '#fetch called but #hasMore returns false'));
    }

    return this.fetchRaw(this.fetchOptions)
      .then(modelsData => {
        if (!Array.isArray(modelsData)) {
          throw new SdkError(this, `Invalid response from the http API. Should have returned array, got "${JSON.stringify(modelsData)}"`);
        }

        modelsData.forEach(data => {
          this.add(this.buildModel(data), true, false);
        });

        this._loaded = true;

        return this;
      });
  }

  /**
   * Adds a model to the collection.
   *
   * @param model
   * @param {boolean} [replace = true] If a model with the same ID already exists, overwrite it if true. Ignore the new model if false.
   * @param {boolean} [persist = true] Currently unused - Persist the model on the server.
   */
  add(model, replace = true, persist = true) {
    this._models.push(model);
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

  [Symbol.iterator]() {
    const _this = this;

    return {
      next: function () {
        if (this._index >= _this.length) {
          return { done: true };
        }

        return { done: false, value: _this.at(this._index++) };
      },

      _index: 0
    };
  }
}

ClassUtil.merge(BaseCollection, FetchMixin, FindMixin);

export default BaseCollection;
