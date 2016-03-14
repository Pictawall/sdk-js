// Node compatibility module
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
if (typeof require.ensure !== 'function') {
  require.ensure = function (dependencies, callback) {
    callback(require);
  };
}

function _downloadFetch(cb) {
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

var FetchShim = {

  /**
   * Loads the right fetch polyfill
   * - node-fetch in a node env.
   * - whatwg-fetch in a browser without fetch support.
   * - Nothing in a browser with fetch support.
   *
   * @returns {Promise}
   */

  loadFetchPolyfill: function loadFetchPolyfill() {
    var _this = this;

    if (this.fetch) {
      return Promise.resolve(this.fetch);
    }

    return new Promise(function (resolve) {
      _downloadFetch(function (_ref) {
        var fetch = _ref.fetch;
        var Response = _ref.Response;

        _this.fetch = fetch;
        _this.Response = Response;
        resolve(fetch);
      });
    });
  }
};

exports.default = FetchShim;