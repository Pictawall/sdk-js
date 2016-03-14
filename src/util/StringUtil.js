'use strict';

/**
 * Utility class for string-related operations.
 *
 * @namespace StringUtil
 */
const StringUtil = {

  /**
   * Searches a string for "{<index>}" tokens and replaces them with the value of <index> in args.
   *
   * @param {!string} str The string to parse.
   * @param {!boolean} deleteUnknown Remove tokens that do not have a match in args.
   * @param {!(Object.<String, *>|Array|*)} args The parameters to insert in the string.
   * @returns {!string} The string with the parameters inserted.
   *
   * @example
   * StringUtil.format('/event/{eventId}', true, { eventId: 48 }) // => /event/48
   * StringUtil.format('/event/{0}', true, [48]) // => /event/48
   * StringUtil.format('/event/{0}', true, 48) // => /event/48
   * StringUtil.format('/event/{0}', true) // => /event/
   * StringUtil.format('/event/{0}', false) // => /event/{0}
   */
  format(str, deleteUnknown, ...args) {
    if (args.length === 1 && typeof args[0] === 'object') {
      args = args[0];
    }

    return str.replace(/{(\w+)}/g, (match, fieldName) => {
      if (args[fieldName] === void 0) {
        if (deleteUnknown) {
          return '';
        } else {
          return match;
        }
      } else {
        return args[fieldName];
      }
    });
  },

  /**
   * Converts an object of key -> values to a query string with the same key -> values.
   *
   * @param {Object.<String, *>} [queryObject = {}] List of parameters to set in the query string.
   * @returns {!String}
   *
   * @example
   * StringUtil.buildQueryParameters({ order_by: 'date_desc', limit: 100 }); // ?order_by=date_dec&limit=100
   */
  buildQueryParameters(queryObject = {}) {
    if (queryObject == null) {
      return '';
    }

    const queryParts = Object.getOwnPropertyNames(queryObject);

    if (queryParts.length === 0) {
      return '';
    }

    const queryArray = [];

    queryParts.forEach(queryPart => {
      const partValue = queryObject[queryPart];

      // TODO enhance
      if (Array.isArray(partValue)) {
        partValue.forEach(value => {
          queryArray.push(encodeURIComponent(queryPart) + '[]=' + encodeURIComponent(value));
        });
      } else {
        queryArray.push(encodeURIComponent(queryPart) + '=' + encodeURIComponent(partValue));
      }
    });

    return '?' + queryArray.join('&');
  }
};

export default StringUtil;
