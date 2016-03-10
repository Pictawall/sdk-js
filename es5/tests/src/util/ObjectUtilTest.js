'use strict';

var ObjectUtil = require('../../../src/util/ObjectUtil');

describe('ObjectUtil', function () {

  var object = {
    very: {
      deep: {
        test: 5
      }
    },

    highLevel: 775,
    test: [1, 2, 3]
  };

  describe('find', function () {
    it('returns the object if found', function () {
      expect(ObjectUtil.find(object, 'very.deep.test')).toBe(5);
    });

    it('returns undefined otherwise', function () {
      expect(ObjectUtil.find(object, 'highLevel.deep.test')).toBeUndefined();
    });

    it('even works with arrays', function () {
      expect(ObjectUtil.find(object, 'test.length')).toBe(3);
      expect(ObjectUtil.find([], 'length')).toBe(0);
    });
  });

  describe('exists', function () {
    it('returns true if found', function () {
      expect(ObjectUtil.exists(object, 'very.deep.test')).toBe(true);
    });

    it('returns undefined otherwise', function () {
      expect(ObjectUtil.exists(object, 'woops.deep.test')).toBe(false);
    });
  });
});