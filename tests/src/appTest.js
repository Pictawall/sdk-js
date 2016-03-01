'use strict';

const Sdk = require('../../src/app');

describe('Pictawall SDK', () => {

  it('Is importable', () => {
    expect(Sdk).toEqual(jasmine.any(Object));
    expect(window.pictawall).toBeUndefined();
  });
});
