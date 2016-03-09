'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var ArrayUtil = require('../../util/ArrayUtil');
var ObjectUtil = require('../../util/ObjectUtil');

var SELECTOR_HANDLERS = {

  /**
   * Strict equality selector. Also compares arrays.
   * Selector: { <field>: { $eq: <value> } } or { field: <value> }
   * @param {any} item The item to compare to the query.
   * @param {any} selectorValue The value of $eq in the query.
   */

  eq: function eq(item, selectorValue) {
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
  gt: function gt(item, selectorValue) {
    return item > selectorValue;
  },


  /**
   * Greater than or equal selector.
   * Selector: { <field>: { $gte: <value> } }
   * @param {any} item The item to compare to the query.
   * @param {any} selectorValue The value of $gte in the query.
   */
  gte: function gte(item, selectorValue) {
    return item >= selectorValue;
  },


  /**
   * Greater than selector.
   * Selector: { <field>: { $gt: <value> } }
   * @param {any} item The item to compare to the query.
   * @param {any} selectorValue The value of $gt in the query.
   */
  lt: function lt(item, selectorValue) {
    return item < selectorValue;
  },
  lte: function lte(item, selectorValue) {
    return item <= selectorValue;
  },
  ne: function ne(item, selectorValue) {
    return !this.eq(item, selectorValue);
  },
  in: function _in(item, selectorValue) {
    if (!Array.isArray(selectorValue)) {
      throw new Error('$in and $nin require an Array, got "' + selectorValue + '".');
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;

    var _iteratorError = void 0;

    try {
      for (var _iterator = selectorValue[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var arrayEntry = _step.value;

        if (this.eq(item, arrayEntry)) {
          return true;
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

    return false;
  },
  nin: function nin(item, selectorValue) {
    return !this.in(item, selectorValue);
  },


  // BOOLEAN OPERATORS

  or: function or(item, selectorArray) {
    if (!Array.isArray(selectorArray)) {
      throw new Error('$or and $nor require an Array, got "' + selectorArray + '".');
    }

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;

    var _iteratorError2 = void 0;

    try {
      for (var _iterator2 = selectorArray[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var selector = _step2.value;

        if (executeQuery(item, selector)) {
          return true;
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    return false;
  },
  nor: function nor(item, selectorArray) {
    return !this.or(item, selectorArray);
  },
  and: function and(item, selectorArray) {
    if (!Array.isArray(selectorArray)) {
      throw new Error('$and requires an Array, got "' + selectorArray + '".');
    }

    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;

    var _iteratorError3 = void 0;

    try {
      for (var _iterator3 = selectorArray[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var selector = _step3.value;

        if (!executeQuery(item, selector)) {
          return false;
        }
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    return true;
  },
  not: function not(item, selector) {
    if ((typeof selector === 'undefined' ? 'undefined' : _typeof(selector)) !== 'object') {
      throw new Error('$not requires an object, got "' + selector + '".');
    }
    return !executeQuery(item, selector);
  }
};

function executeQuery(item, selectors) {
  if ((typeof selectors === 'undefined' ? 'undefined' : _typeof(selectors)) !== 'object' || Array.isArray(selectors)) {
    return SELECTOR_HANDLERS.eq(item, selectors);
  }

  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;

  var _iteratorError4 = void 0;

  try {
    for (var _iterator4 = Object.getOwnPropertyNames(selectors)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var selectorName = _step4.value;

      var selectorParameter = selectors[selectorName];

      if (selectorName.charAt(0) === '$') {
        // { <proprietarySelector>: <selectorParameter> } case. ie { $or: [{ $id: 5 }, { $id: 7 }] }
        var selectorHandler = SELECTOR_HANDLERS[selectorName.substr(1)];

        if (selectorHandler === void 0) {
          throw new Error('Unknown WHERE selector "' + selectorName + '"');
        }

        if (!selectorHandler(item, selectorParameter)) {
          return false;
        }
      } else {
        // { <item>: <query> } case
        var itemProperty = ObjectUtil.find(item, selectorName);

        return executeQuery(itemProperty, selectorParameter);
      }
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4.return) {
        _iterator4.return();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
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