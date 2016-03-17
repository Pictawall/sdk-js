'use strict';

import StringUtil from '../../../src/util/StringUtil';

describe('StringUtil', () => {

  describe('format', () => {
    it('inserts indexed parameters', () => {
      expect(StringUtil.format('Hello, {0} {1}', false, 'world', 1)).toBe('Hello, world 1');
    });

    it('inserts named parameters', () => {
      expect(StringUtil.format('Hello, {greeted}', false, { greeted: 'john' })).toBe('Hello, john');
    });

    it('does not replace non-found parameters if told not to', () => {
      expect(StringUtil.format('Hello, {greeted}', false)).toBe('Hello, {greeted}');
    });

    it('does replace non-found parameters if told not', () => {
      expect(StringUtil.format('Hello, {greeted}', true)).toBe('Hello, ');
    });
  });
});
