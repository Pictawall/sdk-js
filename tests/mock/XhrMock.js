'use strict';

require('jasmine-ajax');
const fetchMock = require('./fetchMock');

const config = require('../../src/services/Config').instance;
const StringUtil = require('../../src/util/StringUtil');

function mockRequest(path, pathParams, response) {
  const stubbedPath = new RegExp('^' + config.get('endpoint') + StringUtil.format(path, pathParams) + '([\\?#].*)?$');
  console.info('Mocking xhr path /' + stubbedPath.source + '/');

  fetchMock.stubRequest(stubbedPath, response);
  jasmine.Ajax.stubRequest(stubbedPath).andReturn(response);
}

fetchMock.install();
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

  VALID_EVENT: require('./event.json'),
  VALID_EVENT_ASSETS: require('./event_asset.json')
};
