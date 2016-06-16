'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var loader = new Promise(function (resolve) {
  if (window.fetch) {
    return resolve();
  }

  if (typeof require.ensure !== 'function') {
    require.ensure = function (ignored, callback) {
      return callback(require);
    };
  }

  require.ensure(['whatwg-fetch'], function (require) {
    require('whatwg-fetch');
    resolve();
  }, 'fetch-polyfill-client');
});

exports.default = {
  load: function load() {
    var _this = this;

    return loader.then(function () {
      if (!_this.fetch) {
        _this.fetch = window.fetch.bind(window);
      }

      if (!_this.Response) {
        _this.Response = window.Response;
      }
    });
  },


  set Promise(implementation) {}
};