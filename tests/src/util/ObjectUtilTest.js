'use strict';

const ObjectUtil = require('../../../src/util/ObjectUtil');

describe('ObjectUtil', () => {

  const object = {
    very: {
      deep: {
        test: 5
      }
    },

    highLevel: 775,
    test: [1, 2, 3]
  };

  describe('find', () => {
    it('returns the object if found', () => {
      expect(ObjectUtil.find(object, 'very.deep.test')).toBe(5);
    });

    it('returns undefined otherwise', () => {
      expect(ObjectUtil.find(object, 'highLevel.deep.test')).toBeUndefined();
    });

    it('even works with arrays', () => {
      expect(ObjectUtil.find(object, 'test.length')).toBe(3);
      expect(ObjectUtil.find([], 'length')).toBe(0);
    });
  });

  describe('exists', () => {
    it('returns true if found', () => {
      expect(ObjectUtil.exists(object, 'very.deep.test')).toBe(true);
    });

    it('returns undefined otherwise', () => {
      expect(ObjectUtil.exists(object, 'woops.deep.test')).toBe(false);
    });
  });
});
