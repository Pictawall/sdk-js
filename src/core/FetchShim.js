// Node compatibility module
'use strict';

if (typeof require.ensure !== 'function') {
  require.ensure = function (dependencies, callback) {
    callback(require);
  };
}

function _downloadFetch(cb) {
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

const FetchShim = {

  /**
   * Loads the right fetch polyfill
   * - node-fetch in a node env.
   * - whatwg-fetch in a browser without fetch support.
   * - Nothing in a browser with fetch support.
   *
   * @returns {Promise}
   */
  loadFetchPolyfill() {
    if (this.fetch) {
      return Promise.resolve(this.fetch);
    }

    return new Promise(resolve => {
      _downloadFetch(({ fetch, Response }) => {
        this.fetch = fetch;
        this.Response = Response;
        resolve(fetch);
      });
    });
  }
};

export default FetchShim;
