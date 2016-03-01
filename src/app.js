'use strict';

(function () {

  //noinspection JSUnresolvedVariable // WebPack var injection

  /**
   * @namespace SDK
   * @property {!object} Models
   * @property {!function} Models.Event
   * @property {!String} version
   * @property {!Config} config
   */
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
