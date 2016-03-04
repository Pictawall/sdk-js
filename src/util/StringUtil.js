'use strict';

module.exports = {
  format(str, ...args) {
    return str.replace(/{(\d+)}/g, (match, number) => {
      return args.length > number ? args[number] : match;
    });
  },

  namedFormat(str, namedReplacements = {}, deleteUnknownProperties = true) {
    return str.replace(/{(\w+)}/g, (match, fieldName) => {
      if (namedReplacements[fieldName] === void 0) {
        if (deleteUnknownProperties) {
          return '';
        } else {
          return match;
        }
      }

      return namedReplacements[fieldName];
    });
  }
};
