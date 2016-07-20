'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === void 0) { var parent = Object.getPrototypeOf(object); if (parent === null) { return void 0; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === void 0) { return void 0; } return getter.call(receiver); } };

var _PagedCollection2 = require('./PagedCollection');

var _PagedCollection3 = _interopRequireDefault(_PagedCollection2);

var _FetchMixin = require('../../mixins/FetchMixin');

var _BaseCollection = require('./BaseCollection');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Collection of event ads.
 *
 * @class PictawallPagedCollection
 * @extends PagedCollection
 */

var PictawallPagedCollection = function (_PagedCollection) {
  _inherits(PictawallPagedCollection, _PagedCollection);

  /**
   * @param {!Sdk} sdk - The SDK instance.
   */

  function PictawallPagedCollection(sdk) {
    _classCallCheck(this, PictawallPagedCollection);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(PictawallPagedCollection).call(this, sdk));
  }

  /**
   * @inheritDoc
   */


  _createClass(PictawallPagedCollection, [{
    key: _FetchMixin.Symbols.parseResponse,
    value: function value(response) {
      return _get(Object.getPrototypeOf(PictawallPagedCollection.prototype), _FetchMixin.Symbols.parseResponse, this).call(this, response).data;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: _BaseCollection.Symbols.getUpdatedItems,
    value: function value(since) {
      return regeneratorRuntime.async(function value$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return regeneratorRuntime.awrap(this.fetchRaw(Object.assign(this.fetchOptions, { since: since })));

            case 2:
              _context.t0 = _context.sent;
              return _context.abrupt('return', {
                added: _context.t0
              });

            case 4:
            case 'end':
              return _context.stop();
          }
        }
      }, null, this);
    }
  }]);

  return PictawallPagedCollection;
}(_PagedCollection3.default);

exports.default = PictawallPagedCollection;