'use strict';

/*
 * Client-side entry point
 *
 * - defines the fetch polyfill
 */

import Sdk from './core/Sdk';
import FetchShim from './core/FetchShim';

FetchShim.fetchDownloader = function (cb) {
  function done() {
    cb({ fetch: window.fetch.bind(window), Response: window.Response });
  }

  if (window.fetch) {
    return done();
  }

  if (typeof require.ensure !== 'function') {
    require.ensure = (ignored, callback) => callback(require);
  }

  require.ensure(['whatwg-fetch'], require => {
    require('whatwg-fetch');
    done();
  }, 'fetch-polyfill-client');
};

export default Sdk;
