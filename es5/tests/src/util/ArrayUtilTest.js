'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ArrayUtil = require('../../../src/util/ArrayUtil');

describe('ArrayUtil', function () {

  describe('#areEqual', function () {

    it('returns true if the items are the same instance', function () {
      var array = [];

      expect(ArrayUtil.areEqual(array, array)).toBe(true);
    });

    it('returns true if the arrays are strictly equal', function () {
      expect(ArrayUtil.areEqual([1, 2, 'a', 45, null, false, true], [1, 2, 'a', 45, null, false, true])).toBe(true);
    });

    it('returns false if the arrays do not have the items in the same order', function () {
      expect(ArrayUtil.areEqual([1, 2], [2, 1])).toBe(false);
    });

    it('returns false if the arrays do not have the same items', function () {
      expect(ArrayUtil.areEqual([1, 2, 3], [3, 4, 5])).toBe(false);
      expect(ArrayUtil.areEqual([1, 2], [1])).toBe(false);
    });

    it('returns true if both array are null', function () {
      expect(ArrayUtil.areEqual(null, null)).toBe(true);
    });

    it('returns false if only one of them is null', function () {
      expect(ArrayUtil.areEqual(null, [45])).toBe(false);
      expect(ArrayUtil.areEqual(['a', 'b'], null)).toBe(false);
    });
  });

  describe('#isIterable', function () {
    var DummyIterable = function () {
      function DummyIterable() {
        _classCallCheck(this, DummyIterable);
      }

      _createClass(DummyIterable, [{
        key: Symbol.iterator,
        value: function value() {
          return {
            next: function next() {
              return { done: true };
            }
          };
        }
      }]);

      return DummyIterable;
    }();

    it('returns true for iterable parameters', function () {
      expect(ArrayUtil.isIterable([])).toBe(true);
      expect(ArrayUtil.isIterable('hello')).toBe(true);
      expect(ArrayUtil.isIterable(new Map())).toBe(true);
      expect(ArrayUtil.isIterable(new DummyIterable())).toBe(true);
    });

    it('returns false for non-iterable parameters', function () {
      expect(ArrayUtil.isIterable(42)).toBe(false);
      expect(ArrayUtil.isIterable(true)).toBe(false);
      expect(ArrayUtil.isIterable(function () {})).toBe(false);
    });
  });
});