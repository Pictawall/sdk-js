'use strict';

/*
 * Client-side entry point
 *
 * - defines the fetch polyfill
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Sdk = require('./core/Sdk');

var _Sdk2 = _interopRequireDefault(_Sdk);

var _FetchShim = require('./core/FetchShim');

var _FetchShim2 = _interopRequireDefault(_FetchShim);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_FetchShim2.default.fetchDownloader = function (cb) {
  function done() {
    cb({ fetch: window.fetch.bind(window), Response: window.Response });
  }

  if (window.fetch) {
    return done();
  }

  if (typeof require.ensure !== 'function') {
    require.ensure = function (ignored, callback) {
      return callback(require);
    };
  }

  require.ensure(['whatwg-fetch'], function (require) {
    require('whatwg-fetch');
    done();
  }, 'fetch-polyfill-client');
};

exports.default = _Sdk2.default;