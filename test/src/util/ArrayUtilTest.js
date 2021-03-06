'use strict';

import ArrayUtil from '../../../src/util/ArrayUtil';

describe('ArrayUtil', () => {

  describe('#areEqual', () => {

    it('returns true if the items are the same instance', () => {
      const array = [];

      expect(ArrayUtil.areEqual(array, array)).toBe(true);
    });

    it('returns true if the arrays are strictly equal', () => {
      expect(ArrayUtil.areEqual([1, 2, 'a', 45, null, false, true], [1, 2, 'a', 45, null, false, true])).toBe(true);
    });

    it('returns false if the arrays do not have the items in the same order', () => {
      expect(ArrayUtil.areEqual([1, 2], [2, 1])).toBe(false);
    });

    it('returns false if the arrays do not have the same items', () => {
      expect(ArrayUtil.areEqual([1, 2, 3], [3, 4, 5])).toBe(false);
      expect(ArrayUtil.areEqual([1, 2], [1])).toBe(false);
    });

    it('returns true if both array are null', () => {
      expect(ArrayUtil.areEqual(null, null)).toBe(true);
    });

    it('returns false if only one of them is null', () => {
      expect(ArrayUtil.areEqual(null, [45])).toBe(false);
      expect(ArrayUtil.areEqual(['a', 'b'], null)).toBe(false);
    });
  });

  describe('#isIterable', () => {

    class DummyIterable {
      [Symbol.iterator]() {
        return {
          next() {
            return { done: true };
          }
        };
      }
    }

    it('returns true for iterable parameters', () => {
      expect(ArrayUtil.isIterable([])).toBe(true);
      expect(ArrayUtil.isIterable('hello')).toBe(true);
      expect(ArrayUtil.isIterable(new Map())).toBe(true);
      expect(ArrayUtil.isIterable(new DummyIterable())).toBe(true);
    });

    it('returns false for non-iterable parameters', () => {
      expect(ArrayUtil.isIterable(42)).toBe(false);
      expect(ArrayUtil.isIterable(true)).toBe(false);
      expect(ArrayUtil.isIterable(function () {})).toBe(false);
    });
  });
});
