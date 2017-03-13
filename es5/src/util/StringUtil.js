'use strict';

/**
 * Utility class for string-related operations.
 *
 * @namespace StringUtil
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
  }
};

exports.default = StringUtil;