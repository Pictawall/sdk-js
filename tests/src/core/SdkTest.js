'use strict';

const singletons = require('../singletons');
const FetchShim = require('../../../src/core/FetchShim');

describe('SDK', () => {

  it('loads required polyfills', done => {
    singletons.sdk.loadPolyfills().then(() => {
      expect(Map.prototype.toJSON).toEqual(jasmine.any(Function));
      expect(FetchShim.fetch).toEqual(jasmine.any(Function));

      done();
    }).catch(e => {
      fail(e);
      done();
    });
  });
});
