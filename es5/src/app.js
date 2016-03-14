'use strict';

var _Sdk = require('./core/Sdk');

var _Sdk2 = _interopRequireDefault(_Sdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  if (module && module.exports) {
    module.exports = _Sdk2.default;
  } else {
    if (window.pictawall === void 0) {
      window.pictawall = {};
    }

    if (window.pictawall.Sdk === void 0) {
      window.pictawall.Sdk = _Sdk2.default;

      //noinspection JSUnresolvedVariable
      window.pictawall.Sdk.version = PACKAGE_VERSION;
    }
  }
})();