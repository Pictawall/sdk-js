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
  },

  buildQueryParameters(queryObject = {}) {
    if (queryObject == null) {
      return '';
    }

    const queryParts = Object.getOwnPropertyNames(queryObject);

    if (queryParts.length === 0) {
      return '';
    }

    return '?' + (queryParts.map(queryPart => {
      const partValue = queryObject[queryPart];

      return encodeURIComponent(queryPart) + '=' + encodeURIComponent(partValue);
    }).join('&'));
  }
};
