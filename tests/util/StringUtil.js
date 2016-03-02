'use strict';

module.exports = {
  format: function (str, ...args) {
    return str.replace(/{(\d+)}/g, function (match, number) {
      return args.length > number ? args[number] : match;
    });
  }
};
