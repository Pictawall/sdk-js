'use strict';

const singletons = require('../singletons');

describe('SDK', () => {

  it('loads required polyfills', done => {
    singletons.sdk.loadPolyfills().then(() => {
      expect(Map.prototype.toJSON).toEqual(jasmine.any(Function));
      expect(window.fetch).toEqual(jasmine.any(Function));

      done();
    });
  });
});
