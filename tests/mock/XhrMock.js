'use strict';

require('jasmine-ajax');
const config = require('../../src/services/Config');
const StringUtil = require('./../util/StringUtil');

function mockRequest(path, pathParams, response) {
  jasmine.Ajax.stubRequest(new RegExp(config.get('endpoint') + StringUtil.format(path, pathParams) + '.*')).andReturn(response);
}

module.exports = {
  init() {
    jasmine.Ajax.install();

    // VALID ROUTES
    mockRequest('/events/{0}', [this.VALID_IDENTIFIER], {
      status: 200,
      responseText: JSON.stringify(this.VALID_EVENT)
    });

    mockRequest('/events/{0}/assets', [this.VALID_IDENTIFIER], {
      status: 200,
      responseText: JSON.stringify(this.VALID_EVENT_ASSETS)
    });

    // INVALID ROUTES
    mockRequest('/events/{0}', [this.INVALID_IDENTIFIER], {
      status: 404
    });

    mockRequest('/events/{0}/assets', [this.INVALID_IDENTIFIER], {
      status: 404
    });
  },

  destroy() {
    jasmine.Ajax.uninstall();
  },

  VALID_IDENTIFIER: 'VALID',
  INVALID_IDENTIFIER: 'INVALID',

  VALID_EVENT: {
    name: 'Batibouw 2016',
    identifier: 'VALID',
    ratio: 12,
    showHashtag: false,
    showTopUsers: false
  },

  VALID_EVENT_ASSETS: require('./event_asset.json')
};
