'use strict';

import MongoFinder from './MongoQuery/MongoFinder';

/**
 * <p>This mixin adds a MongoDB-like find syntax to iterables.</p>
 * <p>The syntax does not exactly match the MongoDB one but is highly inspired from it. For instance,
 *    it would be silly to make these methods asynchronous as they're not performing any IO operation.<p>
 * <p>The point is however to add as much support for the query syntax as possible.<p>
 *
 * @mixin FindMixin
 */
const FindMixin = {

  /**
   * Returns the first model matching a query. See {@link MongoFinder} for query documentation.
   *
   * @param {!(function|object)} query A find query.
   * @returns {BaseModel} The matching model.
   *
   * @instance
   */
  findOne(query) {
    return this.find(query).limit(1).first();
  },

  /**
   * Returns the cursor handling the query. See {@link MongoFinder} for query documentation.
   *
   * @param {!(function|object)} query A find query.
   * @returns {MongoFinder}
   *
   * @instance
   */
  find(query) {
    return new MongoFinder(query, this);
  }
};

export default FindMixin;
