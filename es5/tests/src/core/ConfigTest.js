'use strict';

var Config = require('../../../src/core/Config');

describe('Config', function () {

  var config = new Config();

  it('Set defines a config option, get retrieves it', function () {
    var key = 'thisisakey';
    var value = { a: 'nom nom' };

    config.set(key, value);

    expect(config.get(key)).toBe(value);
  });

  it('get returns a default value if the option is unknown', function () {
    var defaultValue = 'Pomme de pain au chocolat';

    expect(config.get('I do not exist', defaultValue)).toBe(defaultValue);
  });
});