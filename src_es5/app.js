'use strict';

(function () {
  var Sdk = require('./core/Sdk');

  if (module && module.exports) {
    module.exports = Sdk;
  } else {
    if (window.pictawall === void 0) {
      window.pictawall = {};
    }

    if (window.pictawall.Sdk === void 0) {
      window.pictawall.Sdk = Sdk;

      //noinspection JSUnresolvedVariable
      window.pictawall.Sdk.version = PACKAGE_VERSION;
    }
  }
})();