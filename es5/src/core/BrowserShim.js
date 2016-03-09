// Node compatibility module
'use strict';

if (typeof require.ensure !== 'function') {
  require.ensure = function (dependencies, callback) {
    callback(require);
  };
}

function downloadFetch(cb) {
  if (typeof window !== 'undefined' && window.fetch) {
    cb({ fetch: window.fetch, Response: window.Response });
  } else if (typeof XMLHttpRequest !== 'function') {
    require.ensure(['node-fetch'], function (require) {
      var fetch = require('node-fetch');
      cb({ fetch: fetch, Response: fetch.Response });
    }, 'fetch-polyfill-server');
  } else {
    require.ensure(['whatwg-fetch'], function (require) {
      require('whatwg-fetch');
      cb({ fetch: window.fetch, Response: window.Response });
    }, 'fetch-polyfill-client');
  }
}

module.exports = {
  global: function () {
    try {
      return Function('return this')();
    } catch (e) {
      return window;
    }
  }(),

  loadFetchPolyfill: function loadFetchPolyfill() {
    var _this = this;

    if (this.fetch) {
      return Promise.resolve(this.fetch);
    }

    return new Promise(function (resolve) {
      downloadFetch(function (_ref) {
        var fetch = _ref.fetch;
        var Response = _ref.Response;

        _this.fetch = fetch;
        _this.Response = Response;
        resolve(fetch);
      });
    });
  }
};