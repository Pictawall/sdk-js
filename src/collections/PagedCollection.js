'use strict';

import BaseCollection from './BaseCollection';

/**
 * Collection able to fetch data from the API in a paged fashion.
 *
 * @class PagedCollection
 */
class PagedCollection extends BaseCollection {

  /**
   * @param {!Sdk} sdk The instance of the SDK owning this collection.
   * @param {number} [limit] How many models a fetch call should return.
   * @param {string} [orderBy] Model sort order. Collection-specific, Please refer to the API documentation.
   */
  constructor(sdk, limit, orderBy) {
    super(sdk);

    this._limit = limit;
    this._orderBy = orderBy;

    this._currentPage = 0;
    this._pageCount = null;
    this._total = null;
    this._since = null;
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

    if (this._since) {
      options.since = this._since;
    }

    if (this._orderBy) {
      options.order_by = this._orderBy;// jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
    }

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
    this._since = serverResponse.since;
  }
}

export default PagedCollection;
