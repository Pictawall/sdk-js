'use strict';

const Config = require('../../../src/services/Config');

describe('Config', () => {

  it('is a singleton', () => {
    expect(Config.instance).toEqual(jasmine.any(Config));
  });

  describe('Accessor', () => {
    const config = new Config();

    it('Set defines a config option, get retrieves it', () => {
      const key = 'thisisakey';
      const value = { a: 'nom nom' };

      config.set(key, value);

      expect(config.get(key)).toBe(value);
    });

    it('get returns a default value if the option is unknown', () => {
      const defaultValue = 'Pomme de pain au chocolat';

      expect(config.get('I do not exist', defaultValue)).toBe(defaultValue);
    });
  });
});

