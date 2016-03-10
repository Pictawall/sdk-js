'use strict';

/**
 * Utility class for array-related operations.
 *
 * @namespace ArrayUtil
 */
const ArrayUtil = {

  /**
   * <p>Returns whether two arrays are equal or not.</p>
   * <p>[Source](http://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript)</p>
   *
   * @param {Array} a An array.
   * @param {Array} b Another array.
   * @returns {boolean} Both arrays are equal.
   */
  areEqual(a, b) {
    if (a === b) {
      return true;
    }

    if (a == null || b == null) {
      return false;
    }

    if (a.length !== b.length) {
      return false;
    }

    for (let i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) {
        return false;
      }
    }

    return true;
  }
};

module.exports = ArrayUtil;
