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
  }
};

export default StringUtil;
