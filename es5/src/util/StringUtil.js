'use strict';

/**
 * Utility class for string-related operations.
 *
 * @namespace StringUtil
 */

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var StringUtil = {

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

  format: function format(str, deleteUnknown) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    if (args.length === 1 && _typeof(args[0]) === 'object') {
      args = args[0];
    }

    return str.replace(/{(\w+)}/g, function (match, fieldName) {
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
  buildQueryParameters: function buildQueryParameters() {
    var queryObject = arguments.length <= 0 || arguments[0] === void 0 ? {} : arguments[0];

    if (queryObject == null) {
      return '';
    }

    var queryParts = Object.getOwnPropertyNames(queryObject);

    if (queryParts.length === 0) {
      return '';
    }

    var queryArray = [];

    queryParts.forEach(function (queryPart) {
      var partValue = queryObject[queryPart];

      // TODO enhance
      if (Array.isArray(partValue)) {
        partValue.forEach(function (value) {
          queryArray.push(encodeURIComponent(queryPart) + '[]=' + encodeURIComponent(value));
        });
      } else {
        queryArray.push(encodeURIComponent(queryPart) + '=' + encodeURIComponent(partValue));
      }
    });

    return '?' + queryArray.join('&');
  }
};

module.exports = StringUtil;