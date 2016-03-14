'use strict';

const ArrayUtil = require('../../util/ArrayUtil');
const ObjectUtil = require('../../util/ObjectUtil');

const SELECTOR_HANDLERS = {

  /**
   * Strict equality selector. Also compares arrays.
   * Selector: { <field>: { $eq: <value> } } or { field: <value> }
   * @param {*} item The item to compare to the query.
   * @param {*} selectorValue The value of $eq in the query.
   */
  eq(item, selectorValue) {

    // Array special case
    if (Array.isArray(item) || Array.isArray(selectorValue)) {
      return ArrayUtil.areEqual(item, selectorValue);
    }

    return (item  === 0 && selectorValue === 0) || Object.is(item, selectorValue);
  },

  /**
   * Greater than selector.
   * Selector: { <field>: { $gt: <value> } }
   * @param {*} item The item to compare to the query.
   * @param {*} selectorValue The value of $gt in the query.
   */
  gt(item, selectorValue) {
    return item > selectorValue;
  },

  /**
   * Greater than or equal selector.
   * Selector: { <field>: { $gte: <value> } }
   * @param {*} item The item to compare to the query.
   * @param {*} selectorValue The value of $gte in the query.
   */
  gte(item, selectorValue) {
    return item >= selectorValue;
  },

  /**
   * Greater than selector.
   * Selector: { <field>: { $gt: <value> } }
   * @param {*} item The item to compare to the query.
   * @param {*} selectorValue The value of $gt in the query.
   */
  lt(item, selectorValue) {
    return item < selectorValue;
  },

  lte(item, selectorValue) {
    return item <= selectorValue;
  },

  ne(item, selectorValue) {
    return !SELECTOR_HANDLERS.eq(item, selectorValue);
  },

  in(item, selectorValue) {
    if (!Array.isArray(selectorValue)) {
      throw new Error(`$in and $nin require an Array, got "${selectorValue}".`);
    }

    for (let arrayEntry of selectorValue) {
      if (SELECTOR_HANDLERS.eq(item, arrayEntry)) {
        return true;
      }
    }

    return false;
  },

  nin(item, selectorValue) {
    return !SELECTOR_HANDLERS.in(item, selectorValue);
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
    return !SELECTOR_HANDLERS.or(item, selectorArray);
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
      const itemProperty = ObjectUtil.find(item, selectorName);

      if (!executeQuery(itemProperty, selectorParameter)) {
        return false;
      }
    }
  }

  return true;
}

module.exports = function (query) {
  return function (item) {
    if (item.toJSON) {
      item = item.toJSON();
    }

    return executeQuery(item, query);
  };
};
