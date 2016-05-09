'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  load: function load() {},


  fetch: _nodeFetch2.default,
  Response: _nodeFetch.Response,

  set Promise(implementation) {
    if (_nodeFetch2.default.Promise === global.Promise) {
      _nodeFetch2.default.Promise = implementation;
    }
  }
};