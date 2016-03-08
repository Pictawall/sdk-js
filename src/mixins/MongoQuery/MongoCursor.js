'use strict';

const parseSortQuery = require('./mongoSortParser');
const parseWhereQuery = require('./mongoWhereParser');

const stateMap = new WeakMap();

function executeQuery(state) {

  // 0. clone
  const array = Array.from(state.iterable);

  // 1. sort
  if (state.sortQuery) {
    const sortQuery = state.sortQuery;
    if (sortQuery.$natural) {
      if (sortQuery.$natural === -1) {
        array.reverse();
      }
    } else {
      const comparator = typeof sortQuery === 'function' ? sortQuery : parseSortQuery(sortQuery);
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

  const matchesItem = typeof state.query === 'function' ? state.query : parseWhereQuery(state.query);
  const matchList = [];

  for (let i = state.startAt || 0; i < array.length; i++) {
    if (state.limit && matchList.length >= state.limit) {
      break;
    }

    const item = array[i];
    if (matchesItem(item)) {
      matchList.push(item);
    }
  }

  // 3. return
  return matchList;
}

class MongoCursor {

  /**
   * @param {!Object, function} query A {@link Array#filter}-like function or a [MongoDB find query syntax]{@link https://docs.mongodb.org/manual/reference/method/db.collection.find/}.
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
  constructor(query, iterable) {
    stateMap.set(this, {
      query, iterable
    });
  }

  /**
   * Limits the number of items to return.
   * @param {!number} limit The desired limit.
   */
  limit(limit) {
    this._ensurePending();

    stateMap.get(this).limit = limit;

    return this;
  }

  /**
   * Specifies the number of items to skip when performing the query.
   * @param {!number} startAt Number of items to skip.
   */
  skip(startAt) {
    this._ensurePending();

    stateMap.get(this).startAt = startAt;

    return this;
  }

  /**
   * Specifies a sort instruction to execute before
   * @param {!function|object} sortQuery a comparator function (like with {@link Array#sort}) or a [MongoDB sort query]{@link https://docs.mongodb.org/manual/reference/method/cursor.sort/#cursor.sort}
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
  sort(sortQuery) {
    this._ensurePending();

    stateMap.get(this).sortQuery = sortQuery;

    return this;
  }

  /**
   * Returns the result of the query as an array.
   * @returns {!Array.<any>} The list of items from the iterable matching the query.
   */
  toArray() {
    const state = stateMap.get(this);

    if (state.result === void 0) {
      state.result = executeQuery(state);
    }

    return state.result;
  }

  /**
   * Returns the first matching item for the query or null if none matched.
   * @returns {any}
   */
  first() {
    return this.toArray()[0] || null;
  }

  /**
   * Executes a function on every item matching the query.
   * @param {!function} cb The function to execute on each item. Similar to {@link Array#forEach}'s.
   */
  forEach(cb) {
    this.toArray().forEach(cb);

    return this;
  }

  _ensurePending() {
    if (this._ready()) {
      throw new Error('Cannot change the limit after the query has been executed.');
    }
  }

  _ready() {
    return stateMap.get(this).result !== void 0;
  }
}

module.exports = MongoCursor;
