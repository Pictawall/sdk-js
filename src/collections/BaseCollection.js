'use strict';

const merge = require('../util/merge');
const FetchMixin = require('../mixins/FetchMixin');

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
    this.fetchRaw(queryParameters).then(modelsData => {
      if (!Array.isArray(modelsData)) {
        throw new Error('Invalid data for model creation, should have received array.');
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
    throw new Error('Not implemented by the collection.');
  }

  toJson() {
    return this._models;
  }

  get fetchOptions() {
    return Object.assign({}, this._fetchOptions);
  }
}

merge(BaseCollection, FetchMixin);

module.exports = BaseCollection;
