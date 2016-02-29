'use strict';

(function () {

  //noinspection JSUnresolvedVariable // WebPack var injection
  const SDK = {
    Models: {
      Event: require('./models/EventModel')
    },
    version: PACKAGE_VERSION === void 0 ? 'unknown' : PACKAGE_VERSION,
    config: require('./services/Config')
  };

  if (typeof module === 'object' && module.exports) {
    module.exports = SDK;
  } else if (typeof window === 'object') {
    if (window.pictawall === void 0) {
      window.pictawall = {};
    }

    window.pictawall.SDK = SDK;
  }
})();
