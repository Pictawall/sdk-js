'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BaseCollection = require('../collections/abstract/BaseCollection');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Fully refetches the collection when updating.
 *
 * Used by MessageCollection and AdCollection.
 * @mixin updateReplaceMixin
 */
exports.default = _defineProperty({}, _BaseCollection.Symbols.getUpdatedItems, function _callee() {
  var modelList;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(this.fetchRaw(this.fetchOptions));

        case 2:
          modelList = _context.sent;
          return _context.abrupt('return', { removed: modelList, added: modelList });

        case 4:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
});