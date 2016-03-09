'use strict';

const singletons = require('../singletons');
const BrowserShim = require('../../../src/core/BrowserShim');

describe('SDK', () => {

  it('loads required polyfills', done => {
    singletons.sdk.loadPolyfills().then(() => {
      expect(Map.prototype.toJSON).toEqual(jasmine.any(Function));
      expect(BrowserShim.fetch).toEqual(jasmine.any(Function));

      done();
    }).catch(e => {
      fail(e);
      done();
    });
  });
});
