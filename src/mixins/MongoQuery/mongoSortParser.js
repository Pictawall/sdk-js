'use strict';

import ObjectUtil from '../../util/ObjectUtil';

/**
 * Computes which of a or b should be first in the sorted list based on a sort query.
 * @param {!Object} a An object.
 * @param {!Object} b Another object of the same type.
 * @param {!Object} sortQuery A Mongo-like sort query.
 *
 * @private
 */
function sortItems(a, b, sortQuery) {
  for (let fieldName of Object.getOwnPropertyNames(sortQuery)) {
    const sortOrder = sortQuery[fieldName];

    const fieldA = ObjectUtil.find(a, fieldName);
    const fieldB = ObjectUtil.find(b, fieldName);

    let result;
    if (typeof sortOrder === 'object') {
      // the query has multiple levels! We need to go deeper!.
      result = sortItems(fieldA, fieldB, sortOrder);
    } else {
      result = sortItem(fieldA, fieldB, sortOrder);
    }

    if (result !== 0) {
      return result;
    }
  }
}

/**
 * @param {!*} fieldA
 * @param {!*} fieldB
 * @param {!number} sortOrder
 *
 * @private
 */
function sortItem(fieldA, fieldB, sortOrder) {
  if (fieldA === fieldB) {
    return 0;
  }

  if (fieldA > fieldB) {
    return sortOrder;
  }

  return -sortOrder;
}

/**
 * Converts a sort query into a comparator function.
 * @param {!Object} sortQuery
 * @example
 * parseSortQuery({
 *  id: 1,
 *  source: {
 *   id: 1,
 *   network: -1
 *  }
 * });
 *
 * @private
 */
export default function (sortQuery) {
  return function (a, b) {
    return sortItems(a, b, sortQuery);
  };
}
