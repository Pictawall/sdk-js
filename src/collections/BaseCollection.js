'use strict';

const ClassUtil = require('../util/ClassUtil');
const SdkError = require('../core/Errors').SdkError;

/**
 * @mixes FetchMixin
 * @mixes FindMixin
 */
class BaseCollection {

  constructor() {
    this._loaded = false;

    this.reset();
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
   * Model factory
   * @return {!BaseModel}
   */
  createModel() {
    throw new SdkError('CreateModel not implemented');
  }

  hasMore() {
    return !this._loaded;
  }

  /**
   * Downloads and populates the collection.
   * @returns {Promise.<this>}
   */
  fetch() {
    return this.fetchRaw(this.fetchOptions)
      .then(modelsData => {
        if (!Array.isArray(modelsData)) {
          throw new SdkError(this, `Invalid response from #parse(data). Should have returned array, got "${JSON.stringify(modelsData)}"`);
        }

        modelsData.forEach(data => {
          const model = this.createModel(data);
          model.setProperties(data);

          this.add(model, true, false);
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

  reset() {
    this._models = [];
  }

  toJson() {
    return this._models;
  }

  get fetchOptions() {
    return {};
  }

  get loaded() {
    return this._loaded;
  }

  get length() {
    return this._models.length;
  }

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

const FetchMixin = require('../mixins/FetchMixin');
const FindMixin = require('../mixins/FindMixin');

ClassUtil.merge(BaseCollection, FetchMixin, FindMixin);

module.exports = BaseCollection;
