// Node compatibility module
'use strict';

module.exports = {
  global: function () {
    try {
      return Function('return this')();
    } catch (e) {
      return window;
    }
  }()
};