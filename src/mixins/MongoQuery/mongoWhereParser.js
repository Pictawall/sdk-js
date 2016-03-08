'use strict';

const ArrayUtil = require('../../util/ArrayUtil');

//{
//  $and: [{ "lname": "ford" }, { "marks.english": { $gt: 35 } }]
//}

const SELECTOR_HANDLERS = {

  /**
   * Strict equality selector. Also compares arrays.
   * Selector: { <field>: { $eq: <value> } } or { field: <value> }
   * @param {any} item The item to compare to the query.
   * @param {any} selectorValue The value of $eq in the query.
   */
  eq(item, selectorValue) {
    // Array special case
    if (Array.isArray(item)) {
      return ArrayUtil.areEqual(item, selectorValue);
    }

    if (item !== item && selectorValue !== selectorValue) {
      return true;
    }

    return item === selectorValue;
  },

  /**
   * Greater than selector.
   * Selector: { <field>: { $gt: <value> } }
   * @param {any} item The item to compare to the query.
   * @param {any} selectorValue The value of $gt in the query.
   */
  gt(item, selectorValue) {
    return item > selectorValue;
  },

  /**
   * Greater than or equal selector.
   * Selector: { <field>: { $gte: <value> } }
   * @param {any} item The item to compare to the query.
   * @param {any} selectorValue The value of $gte in the query.
   */
  gte(item, selectorValue) {
    return item >= selectorValue;
  },

  /**
   * Greater than selector.
   * Selector: { <field>: { $gt: <value> } }
   * @param {any} item The item to compare to the query.
   * @param {any} selectorValue The value of $gt in the query.
   */
  lt(item, selectorValue) {
    return item < selectorValue;
  },

  lte(item, selectorValue) {
    return item <= selectorValue;
  },

  ne(item, selectorValue) {
    return !this.eq(item, selectorValue);
  },

  in(item, selectorValue) {
    if (!Array.isArray(selectorValue)) {
      throw new Error(`$in and $nin require an Array, got "${selectorValue}".`);
    }

    for (let arrayEntry of selectorValue) {
      if (this.eq(item, arrayEntry)) {
        return true;
      }
    }

    return false;
  },

  nin(item, selectorValue) {
    return !this.in(item, selectorValue);
  },

  // BOOLEAN OPERATORS

  or(item, selectorArray) {
    if (!Array.isArray(selectorArray)) {
      throw new Error(`$or and $nor require an Array, got "${selectorArray}".`);
    }

    for (let selector of selectorArray) {
      if (executeQuery(item, selector)) {
        return true;
      }
    }

    return false;
  },

  nor(item, selectorArray) {
    return !this.or(item, selectorArray);
  },

  and(item, selectorArray) {
    if (!Array.isArray(selectorArray)) {
      throw new Error(`$and requires an Array, got "${selectorArray}".`);
    }

    for (let selector of selectorArray) {
      if (!executeQuery(item, selector)) {
        return false;
      }
    }

    return true;
  },

  not(item, selector) {
    if (typeof selector !== 'object') {
      throw new Error(`$not requires an object, got "${selector}".`);
    }

    return !executeQuery(item, selector);
  }
};

function executeQuery(item, selectors) {
  if (typeof selectors !== 'object' || Array.isArray(selectors)) {
    return SELECTOR_HANDLERS.eq(item, selectors);
  }

  for (let selectorName of Object.getOwnPropertyNames(selectors)) {
    const selectorParameter = selectors[selectorName];

    if (selectorName.charAt(0) === '$') {
      // { <proprietarySelector>: <selectorParameter> } case. ie { $or: [{ $id: 5 }, { $id: 7 }] }
      const selectorHandler = SELECTOR_HANDLERS[selectorName.substr(1)];

      if (selectorHandler === void 0) {
        throw new Error(`Unknown WHERE selector "${selectorName}"`);
      }

      if (!selectorHandler(item, selectorParameter)) {
        return false;
      }
    } else {
      // { <item>: <query> } case
      // split item here.

      return executeQuery(item[selectorName], selectorParameter);
    }
  }

  return true;
}

module.exports = function (query) {
  return function (item) {
    if (item.toJson) {
      item = item.toJson();
    }

    return executeQuery(item, query);
  };
};
