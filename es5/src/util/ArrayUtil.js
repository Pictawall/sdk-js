'use strict';

/**
 * Utility class for array-related operations.
 *
 * @namespace ArrayUtil
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ArrayUtil = {

  /**
   * <p>Returns whether two arrays are equal or not.</p>
   * <p>[Source](http://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript)</p>
   *
   * @param {Array} a An array.
   * @param {Array} b Another array.
   * @returns {boolean} Both arrays are equal.
   */

  areEqual: function areEqual(a, b) {
    if (a === b) {
      return true;
    }

    if (a == null || b == null) {
      return false;
    }

    if (a.length !== b.length) {
      return false;
    }

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) {
        return false;
      }
    }

    return true;
  },


  /**
   * <p>Returns whether or not an object is iterable.</p>
   * <p>http://stackoverflow.com/questions/18884249/checking-whether-something-is-iterable</p>
   *
   * @param {*} obj The object to check.
   */
  isIterable: function isIterable(obj) {
    if (obj == null) {
      return false;
    }

    return obj[Symbol.iterator] !== void 0;
  }
};

exports.default = ArrayUtil;