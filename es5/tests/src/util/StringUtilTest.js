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
});