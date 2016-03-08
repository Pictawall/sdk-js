'use strict';

/*
 * Bower Entry point, NPM users: please includes the parts you need directly.
 */
(function () {

  if (window.pictawall === void 0) {
    window.pictawall = {};
  }

  //noinspection JSUnresolvedVariable // Webpack var injection.
  /**
   * @namespace SDK
   * @property {!object} Models
   * @property {!function} Models.Event
   * @property {!String} version
   * @property {!Config} config
   */
  window.pictawall.SDK = {
    Models: {
      Event: require('./models/EventModel'),
      Channel: require('./models/ChannelModel')
    },
    version: PACKAGE_VERSION === void 0 ? 'unknown' : PACKAGE_VERSION,
    config: require('./services/Config').instance
  };
})();
