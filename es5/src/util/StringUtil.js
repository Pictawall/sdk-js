'use strict';

module.exports = {
  format: function format(str) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return str.replace(/{(\d+)}/g, function (match, number) {
      return args.length > number ? args[number] : match;
    });
  },
  namedFormat: function namedFormat(str) {
    var namedReplacements = arguments.length <= 1 || arguments[1] === void 0 ? {} : arguments[1];
    var deleteUnknownProperties = arguments.length <= 2 || arguments[2] === void 0 ? true : arguments[2];

    return str.replace(/{(\w+)}/g, function (match, fieldName) {
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
  buildQueryParameters: function buildQueryParameters() {
    var queryObject = arguments.length <= 0 || arguments[0] === void 0 ? {} : arguments[0];

    if (queryObject == null) {
      return '';
    }

    var queryParts = Object.getOwnPropertyNames(queryObject);

    if (queryParts.length === 0) {
      return '';
    }

    return '?' + queryParts.map(function (queryPart) {
      var partValue = queryObject[queryPart];

      return encodeURIComponent(queryPart) + '=' + encodeURIComponent(partValue);
    }).join('&');
  }
};