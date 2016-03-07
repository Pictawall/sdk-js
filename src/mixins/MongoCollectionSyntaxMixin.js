'use strict';

const Errors = require('../core/Errors');
const MongoCursor = require('./MongoQuery/MongoCursor');

/**
 * <p>This mixin adds a MongoDB-like find syntax to a collection.</p>
 * <p>The syntax does not exactly match the MongoDB one but is highly inspired from it. For instance,
 *    it would be silly to make these methods asynchronous as they're not performing any IO operation.<p>
 * <p>The point is however to add as much support for the query syntax as possible.<p>
 *
 * @mixin MongoCollectionSyntaxMixin
 */
const MongoCollectionSyntaxMixin = {

  /**
   * Returns the first model matching the [MongoDB find query syntax]{@link https://docs.mongodb.org/manual/reference/method/db.collection.find/}.
   * @param query The MongoDB query.
   * @returns {BaseModel} The matching model.
   *
   * @instance
   */
  findOne(query) {
    const result = this.find(query).limit(1).toArray();

    if (result.length === 0) {
      return null;
    }

    return result[0];
  },

  /**
   * Returns the cursor handling the query. See {@link MongoCursor} for possible operations.
   *
   * @param {Object} query A mongo-like query.
   * @returns {MongoCursor}
   *
   * @instance
   */
  find(query) {
    return new MongoCursor(query, this);
  }
};

module.exports = MongoCollectionSyntaxMixin;
