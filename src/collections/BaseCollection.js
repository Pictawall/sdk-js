'use strict';

const merge = require('../util/merge');
const FetchMixin = require('../mixins/FetchMixin');
const SdkError = require('../core/Errors').SdkError;

/**
 * @mixes FetchMixin
 */
class BaseCollection {

  constructor(fetchOptions = {}) {
    this._fetchOptions = fetchOptions;

    this._loaded = false;

    this.reset();
  }

  fetch(queryParameters) {
    return this.fetchRaw(queryParameters).then(modelsData => {
      if (!Array.isArray(modelsData)) {
        throw new SdkError(this, 'Invalid data for model creation, should have received array.');
      }

      this._loaded = true;
      return modelsData.map(modelData => this.createModel(modelData));
    });
  }

  hasMore() {
    return !this._loaded;
  }

  loadMore() {
    return this.fetch(this.fetchOptions);
  }

  reset() {
    this._models = [];
  }

  createModel() {
    throw new SdkError(this, 'Not implemented by the collection.');
  }

  toJson() {
    return this._models;
  }

  get fetchOptions() {
    return Object.assign({}, this._fetchOptions);
  }

  get loaded() {
    return this._loaded;
  }
}

merge(BaseCollection, FetchMixin);

module.exports = BaseCollection;
