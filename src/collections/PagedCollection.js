'use strict';

import BaseCollection from './BaseCollection';

/**
 * Collection able to fetch data from the API in a paged fashion.
 *
 * @class PagedCollection
 * @extends BaseCollection
 */
class PagedCollection extends BaseCollection {

  /**
   * @param {!Sdk} sdk The instance of the SDK owning this collection.
   * @param {number} [limit] How many models a fetch call should return.
   */
  constructor(sdk, limit) {
    super(sdk);

    this._limit = limit;

    this._currentPage = 0;
    this._pageCount = null;
    this._total = null;
  }

  /**
   * @inheritDoc
   */
  hasMore() {
    return this._currentPage === 0 || this._currentPage < this._pageCount;
  }

  /**
   * @inheritDoc
   */
  get fetchOptions() {
    const options = super.fetchOptions;
    options.page = this._currentPage + 1;

    if (this._limit) {
      options.limit = this._limit;
    }

    return options;
  }

  set fetchParser(parser) {
    super.fetchParser = parser;
  }

  /**
   * @inheritDoc
   */
  get fetchParser() {
    const originalParser = super.fetchParser;

    const _this = this;
    return function (serverResponse) {
      _this._parse(serverResponse);

      return originalParser ? originalParser(serverResponse) : serverResponse;
    };
  }

  /**
   * @private
   */
  _parse(serverResponse) {
    if (serverResponse.currentPage > this._currentPage) {
      this._currentPage = serverResponse.currentPage;
    }

    this._pageCount = serverResponse.pageCount;
    this._total = serverResponse.total;
  }

  /**
   * Total count of assets available in the database.
   * @type {!number}
   */
  get total() {
    return this._total;
  }
}

export default PagedCollection;
