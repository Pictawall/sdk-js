'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _MongoFinder = require('./MongoQuery/MongoFinder');

var _MongoFinder2 = _interopRequireDefault(_MongoFinder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * <p>This mixin adds a MongoDB-like find syntax to iterables.</p>
 * <p>The syntax does not exactly match the MongoDB one but is highly inspired from it. For instance,
 *    it would be silly to make these methods asynchronous as they're not performing any IO operation.<p>
 * <p>The point is however to add as much support for the query syntax as possible.<p>
 *
 * @mixin FindMixin
 */
var FindMixin = {

  /**
   * Returns the first model matching a query. See {@link MongoFinder} for query documentation.
   *
   * @param {!(function|object)} query A find query.
   * @returns {BaseModel} The matching model.
   *
   * @instance
   */

  findOne: function findOne(query) {
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
  find: function find(query) {
    return new _MongoFinder2.default(query, this);
  }
};

exports.default = FindMixin;