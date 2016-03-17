'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ArrayUtil = require('../../../src/util/ArrayUtil');

var _ArrayUtil2 = _interopRequireDefault(_ArrayUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

describe('ArrayUtil', function () {

  describe('#areEqual', function () {

    it('returns true if the items are the same instance', function () {
      var array = [];

      expect(_ArrayUtil2.default.areEqual(array, array)).toBe(true);
    });

    it('returns true if the arrays are strictly equal', function () {
      expect(_ArrayUtil2.default.areEqual([1, 2, 'a', 45, null, false, true], [1, 2, 'a', 45, null, false, true])).toBe(true);
    });

    it('returns false if the arrays do not have the items in the same order', function () {
      expect(_ArrayUtil2.default.areEqual([1, 2], [2, 1])).toBe(false);
    });

    it('returns false if the arrays do not have the same items', function () {
      expect(_ArrayUtil2.default.areEqual([1, 2, 3], [3, 4, 5])).toBe(false);
      expect(_ArrayUtil2.default.areEqual([1, 2], [1])).toBe(false);
    });

    it('returns true if both array are null', function () {
      expect(_ArrayUtil2.default.areEqual(null, null)).toBe(true);
    });

    it('returns false if only one of them is null', function () {
      expect(_ArrayUtil2.default.areEqual(null, [45])).toBe(false);
      expect(_ArrayUtil2.default.areEqual(['a', 'b'], null)).toBe(false);
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
      expect(_ArrayUtil2.default.isIterable([])).toBe(true);
      expect(_ArrayUtil2.default.isIterable('hello')).toBe(true);
      expect(_ArrayUtil2.default.isIterable(new Map())).toBe(true);
      expect(_ArrayUtil2.default.isIterable(new DummyIterable())).toBe(true);
    });

    it('returns false for non-iterable parameters', function () {
      expect(_ArrayUtil2.default.isIterable(42)).toBe(false);
      expect(_ArrayUtil2.default.isIterable(true)).toBe(false);
      expect(_ArrayUtil2.default.isIterable(function () {})).toBe(false);
    });
  });
});