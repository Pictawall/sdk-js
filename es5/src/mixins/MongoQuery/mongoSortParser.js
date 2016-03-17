'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = function (sortQuery) {
  return function (a, b) {
    return sortItems(a, b, sortQuery);
  };
};

var _ObjectUtil = require('../../util/ObjectUtil');

var _ObjectUtil2 = _interopRequireDefault(_ObjectUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Computes which of a or b should be first in the sorted list based on a sort query.
 * @param {!Object} a An object.
 * @param {!Object} b Another object of the same type.
 * @param {!Object} sortQuery A Mongo-like sort query.
 *
 * @private
 */
function sortItems(a, b, sortQuery) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;

  var _iteratorError = void 0;

  try {
    for (var _iterator = Object.getOwnPropertyNames(sortQuery)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var fieldName = _step.value;

      var sortOrder = sortQuery[fieldName];

      var fieldA = _ObjectUtil2.default.find(a, fieldName);
      var fieldB = _ObjectUtil2.default.find(b, fieldName);

      var result = void 0;
      if ((typeof sortOrder === 'undefined' ? 'undefined' : _typeof(sortOrder)) === 'object') {
        // the query has multiple levels! We need to go deeper!.
        result = sortItems(fieldA, fieldB, sortOrder);
      } else {
        result = sortItem(fieldA, fieldB, sortOrder);
      }

      if (result !== 0) {
        return result;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
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