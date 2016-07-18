'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Sdk = require('./Sdk');

var _Sdk2 = _interopRequireDefault(_Sdk);

var _global = require('./global');

var _global2 = _interopRequireDefault(_global);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  load: function load() {
    var _this = this;

    if (typeof _global2.default.URLSearchParams === 'function') {
      this.URLSearchParams = _global2.default.URLSearchParams;
      return _Sdk2.default.Promise.resolve();
    }

    return new _Sdk2.default.Promise(function (resolve) {
      if (typeof require.ensure !== 'function') {
        require.ensure = function (dependencies, callback) {
          callback(require);
        };
      }

      require.ensure(['url-search-params'], function (require) {
        _this.URLSearchParams = require('url-search-params');
        resolve();
      }, 'QueryStringShim-polyfill');
    });
  }
};