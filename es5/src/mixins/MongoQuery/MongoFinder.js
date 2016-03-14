'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mongoSortParser = require('./mongoSortParser');

var _mongoSortParser2 = _interopRequireDefault(_mongoSortParser);

var _mongoWhereParser = require('./mongoWhereParser');

var _mongoWhereParser2 = _interopRequireDefault(_mongoWhereParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var stateMap = new WeakMap();

function executeQuery(state) {

  // 0. clone
  var array = Array.from(state.iterable);

  // 1. sort
  if (state.sortQuery) {
    var sortQuery = state.sortQuery;
    if (sortQuery.$natural) {
      if (sortQuery.$natural === -1) {
        array.reverse();
      }
    } else {
      var comparator = typeof sortQuery === 'function' ? sortQuery : (0, _mongoSortParser2.default)(sortQuery);
      array.sort(comparator);
    }
  }

  // 2. where + skip + limit
  if (state.query === void 0) {
    if (state.startAt || state.limit) {
      return array.splice(state.startAt || 0, state.limit || array.length);
    } else {
      return array;
    }
  }

  var matchesItem = typeof state.query === 'function' ? state.query : (0, _mongoWhereParser2.default)(state.query);
  var matchList = [];

  for (var i = state.startAt || 0; i < array.length; i++) {
    if (state.limit && matchList.length >= state.limit) {
      break;
    }

    var item = array[i];
    if (matchesItem(item)) {
      matchList.push(item);
    }
  }

  // 3. return
  return matchList;
}

/**
 * <p>Implements a Mongo-like queries syntax on iterables.</p>
 *
 * <p>Find queries can either be a [MongoDB find query]{@link https://docs.mongodb.org/manual/reference/method/db.collection.find/} or an {@link Array#filter}-like function.</p>
 * <p>Sort queries can either be a [MongoDB sort query]{@link https://docs.mongodb.org/manual/reference/method/cursor.sort/#cursor.sort} or an an {@link Array#sort}-like comparator function.</p>
 */

var MongoFinder = function () {

  /**
   * @param {!Object|function} query A find query.
   * @param {!Iterable.<Object>} iterable An iterable returning objects having, as a minimum, the properties listed in the query.
   *
   * @example
   * const cursor = new MongoCursor({ id: 1 }, [{ id: 0, name: 'John' }, { id: 1, name: 'Fred' }]);
   * cursor.toArray(); // [{ id: 1, name: 'Fred' }]
   *
   * @example
   * const cursor = new MongoCursor({ '$or': [{id: 1}, {name: 'John'}] }, [{ id: 0, name: 'John' }, { id: 1, name: 'Fred' }]);
   * cursor.sort({ id: -1 }).toArray(); // [{ id: 1, name: 'Fred' }, { id: 0, name: 'John' }]
   */

  function MongoFinder(query, iterable) {
    _classCallCheck(this, MongoFinder);

    stateMap.set(this, {
      query: query, iterable: iterable
    });
  }

  /**
   * Limits the number of items to return.
   * @param {!number} limit The desired limit.
   */


  _createClass(MongoFinder, [{
    key: 'limit',
    value: function limit(_limit) {
      this._ensurePending();

      stateMap.get(this).limit = _limit;

      return this;
    }

    /**
     * Specifies the number of items to skip when performing the query.
     * @param {!number} startAt Number of items to skip.
     */

  }, {
    key: 'skip',
    value: function skip(startAt) {
      this._ensurePending();

      stateMap.get(this).startAt = startAt;

      return this;
    }

    /**
     * Specifies a sort instruction to execute before
     * @param {!function|object} sortQuery A sort query.
     * @example
     * // This will sort the by id in ascending order, them by source.network in descending order, then by source.id in ascending order.
     * sort({
     *  id: 1,
     *  source: {
     *   network: -1,
     *   id: 1
     *  }
     * });
     *
     * @example
     * // Does not sort.
     * sort({
     *  '$natural': 1
     * })
     *
     * @example
     * // Reverses the array.
     * sort({
     *  '$natural': -1
     * })
     */

  }, {
    key: 'sort',
    value: function sort(sortQuery) {
      this._ensurePending();

      stateMap.get(this).sortQuery = sortQuery;

      return this;
    }

    /**
     * Returns the result of the query as an array.
     * @returns {!Array} The list of items from the iterable matching the query.
     */

  }, {
    key: 'toArray',
    value: function toArray() {
      var state = stateMap.get(this);

      if (state.result === void 0) {
        state.result = executeQuery(state);
      }

      return state.result;
    }

    /**
     * Returns the first matching item for the query or null if none matched.
     * @returns {*}
     */

  }, {
    key: 'first',
    value: function first() {
      return this.toArray()[0] || null;
    }

    /**
     * Executes a function on every item matching the query.
     * @param {!function} cb The function to execute on each item. Similar to {@link Array#forEach}'s.
     */

  }, {
    key: 'forEach',
    value: function forEach(cb) {
      this.toArray().forEach(cb);

      return this;
    }
  }, {
    key: '_ensurePending',
    value: function _ensurePending() {
      if (this._ready()) {
        throw new Error('Cannot change the limit after the query has been executed.');
      }
    }
  }, {
    key: '_ready',
    value: function _ready() {
      return stateMap.get(this).result !== void 0;
    }
  }]);

  return MongoFinder;
}();

exports.default = MongoFinder;