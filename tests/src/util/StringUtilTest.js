'use strict';

const StringUtil = require('../../../src/util/StringUtil');

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

  describe('buildQueryParameters', () => {

    it('returns an empty string for empty parameter lists', () => {
      expect(StringUtil.buildQueryParameters({})).toBe('');
      expect(StringUtil.buildQueryParameters(null)).toBe('');
      expect(StringUtil.buildQueryParameters(void 0)).toBe('');
    });

    it('works with 1 query param', () => {
      expect(StringUtil.buildQueryParameters({ test: 'john' })).toBe('?test=john');
    });

    it('works with 2 query params', () => {
      expect(StringUtil.buildQueryParameters({ order_by: 'date_desc', limit: 100 })).toBe('?order_by=date_desc&limit=100');
    });

    it('works with array query params', () => {
      expect(StringUtil.buildQueryParameters({ arrayParam: [1, 2, 3] })).toBe('?arrayParam[]=1&arrayParam[]=2&arrayParam[]=3');
    });
  });
});
