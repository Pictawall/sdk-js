'use strict';

const merge = require('../util/merge');
const SdkError = require('../core/Errors').SdkError;

/**
 * @mixes FetchMixin
 * @mixes FindMixin
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
        throw new SdkError(this, `Invalid response from #parse(data). Should have returned array, got "${JSON.stringify(modelsData)}"`);
      }

      this._loaded = true;
      return modelsData.map(modelData => this.createModel(modelData));
    });
  }

  hasMore() {
    return !this._loaded;
  }

  loadMore() {
    return this.fetch(this.fetchOptions)
      .then(models => {
        for (let model of models) {
          this._models.push(model);
        }
      });
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

merge(BaseCollection, FetchMixin, FindMixin);

module.exports = BaseCollection;
