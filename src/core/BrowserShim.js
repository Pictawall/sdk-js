// Node compatibility module
'use strict';

if(typeof require.ensure !== 'function') {
  require.ensure = function(dependencies, callback) {
    callback(require);
  };
}

function downloadFetch(cb) {
  if (typeof window !== 'undefined' && window.fetch) {
    cb({ fetch: window.fetch, Response: window.Response });
  } else if (typeof XMLHttpRequest !== 'function') {
    require.ensure(['node-fetch'], require => {
      const fetch = require('node-fetch');
      cb({ fetch, Response: fetch.Response });
    }, 'fetch-polyfill-server');
  } else {
    require.ensure(['whatwg-fetch'], require => {
      require('whatwg-fetch');
      cb({ fetch: window.fetch, Response: window.Response });
    }, 'fetch-polyfill-client');
  }
}

module.exports = {
  global: (function () {
    try {
      return Function('return this')();
    } catch (e) {
      return window;
    }
  })(),

  loadFetchPolyfill() {
    if (this.fetch) {
      return Promise.resolve(this.fetch);
    }

    return new Promise(resolve => {
      downloadFetch(({ fetch, Response }) => {
        this.fetch = fetch;
        this.Response = Response;
        resolve(fetch);
      });
    });
  }
};
