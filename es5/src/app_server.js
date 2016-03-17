'use strict';

/*
 * Server-side entry point
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

_FetchShim2.default.fetch = require('node-fetch');
_FetchShim2.default.Response = _FetchShim2.default.fetch.Response;

exports.default = _Sdk2.default;