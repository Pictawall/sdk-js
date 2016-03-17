'use strict';

var _ObjectUtil = require('../../../src/util/ObjectUtil');

var _ObjectUtil2 = _interopRequireDefault(_ObjectUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
      expect(_ObjectUtil2.default.find(object, 'very.deep.test')).toBe(5);
    });

    it('returns undefined otherwise', function () {
      expect(_ObjectUtil2.default.find(object, 'highLevel.deep.test')).toBeUndefined();
    });

    it('even works with arrays', function () {
      expect(_ObjectUtil2.default.find(object, 'test.length')).toBe(3);
      expect(_ObjectUtil2.default.find([], 'length')).toBe(0);
    });
  });

  describe('exists', function () {
    it('returns true if found', function () {
      expect(_ObjectUtil2.default.exists(object, 'very.deep.test')).toBe(true);
    });

    it('returns undefined otherwise', function () {
      expect(_ObjectUtil2.default.exists(object, 'woops.deep.test')).toBe(false);
    });
  });
});