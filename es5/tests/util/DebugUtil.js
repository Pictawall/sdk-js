'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

module.exports = {
  stringify: function stringify(obj) {
    var seen = [];
    console.log(JSON.stringify(obj, function (key, val) {
      if (val != null && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object') {
        if (seen.indexOf(val) >= 0) {
          return '_CYCLIC_REFERENCE_';
        }

        seen.push(val);
      }

      return val;
    }, 4));
  }
};