'use strict';

var _StringUtil = require('../../../src/util/StringUtil');

var _StringUtil2 = _interopRequireDefault(_StringUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('StringUtil', function () {

  describe('format', function () {
    it('inserts indexed parameters', function () {
      expect(_StringUtil2.default.format('Hello, {0} {1}', false, 'world', 1)).toBe('Hello, world 1');
    });

    it('inserts named parameters', function () {
      expect(_StringUtil2.default.format('Hello, {greeted}', false, { greeted: 'john' })).toBe('Hello, john');
    });

    it('does not replace non-found parameters if told not to', function () {
      expect(_StringUtil2.default.format('Hello, {greeted}', false)).toBe('Hello, {greeted}');
    });

    it('does replace non-found parameters if told not', function () {
      expect(_StringUtil2.default.format('Hello, {greeted}', true)).toBe('Hello, ');
    });
  });

  describe('buildQueryParameters', function () {

    it('returns an empty string for empty parameter lists', function () {
      expect(_StringUtil2.default.buildQueryParameters({})).toBe('');
      expect(_StringUtil2.default.buildQueryParameters(null)).toBe('');
      expect(_StringUtil2.default.buildQueryParameters(void 0)).toBe('');
    });

    it('works with 1 query param', function () {
      expect(_StringUtil2.default.buildQueryParameters({ test: 'john' })).toBe('?test=john');
    });

    it('works with 2 query params', function () {
      expect(_StringUtil2.default.buildQueryParameters({ order_by: 'date_desc', limit: 100 })).toBe('?order_by=date_desc&limit=100');
    });

    it('works with array query params', function () {
      expect(_StringUtil2.default.buildQueryParameters({ arrayParam: [1, 2, 3] })).toBe('?arrayParam[]=1&arrayParam[]=2&arrayParam[]=3');
    });
  });
});