'use strict';

module.exports = {
  stringify(obj) {
    const seen = [];
    console.log(JSON.stringify(obj, function (key, val) {
      if (val != null && typeof val === 'object') {
        if (seen.indexOf(val) >= 0) {
          return '_CYCLIC_REFERENCE_';
        }

        seen.push(val);
      }

      return val;
    }, 4));
  }
};
