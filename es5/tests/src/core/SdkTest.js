'use strict';

var singletons = require('../singletons');
var BrowserShim = require('../../../src/core/BrowserShim');

describe('SDK', function () {

  it('loads required polyfills', function (done) {
    singletons.sdk.loadPolyfills().then(function () {
      expect(Map.prototype.toJSON).toEqual(jasmine.any(Function));
      expect(BrowserShim.fetch).toEqual(jasmine.any(Function));

      done();
    }).catch(function (e) {
      fail(e);
      done();
    });
  });
});