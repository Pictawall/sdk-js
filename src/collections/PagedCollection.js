'use strict';

const BaseCollection = require('./BaseCollection');

class PagedCollection extends BaseCollection {

  constructor(limit, orderBy) {
    super();

    this._limit = limit;
    this._orderBy = orderBy;

    this._currentPage = 0;
    this._pageCount = null;
    this._total = null;
    this._since = null;
  }

  /**
   * Returns whether or not there is more to be downloaded from the server.
   * @returns {boolean}
   */
  hasMore() {
    return this._currentPage === 0 || this._currentPage < this._pageCount;
  }

  /**
   * @readonly
   */
  get fetchOptions() {
    const options = super.fetchOptions;
    options.currentPage = this._currentPage + 1;

    if (this._since) {
      options.since = this._since;
    }

    if (this._orderBy) {
      options.order_by = this._orderBy;// jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
    }

    options.limit = this._limit;

    return options;
  }

  parse(data) {
    data = super.parse(data);

    if (data.currentPage > this._currentPage) {
      this._currentPage = data.currentPage;
    }

    this._pageCount = data.pageCount;
    this._total = data.total;
    this._since = data.since;

    return data;
  }
}

module.exports = PagedCollection;
