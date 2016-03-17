'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === void 0) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== void 0) { setter.call(receiver, value); } } return value; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === void 0) { var parent = Object.getPrototypeOf(object); if (parent === null) { return void 0; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === void 0) { return void 0; } return getter.call(receiver); } };

var _BaseCollection2 = require('./BaseCollection');

var _BaseCollection3 = _interopRequireDefault(_BaseCollection2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Collection able to fetch data from the API in a paged fashion.
 *
 * @class PagedCollection
 * @extends BaseCollection
 */

var PagedCollection = function (_BaseCollection) {
  _inherits(PagedCollection, _BaseCollection);

  /**
   * @param {!Sdk} sdk The instance of the SDK owning this collection.
   * @param {number} [limit] How many models a fetch call should return.
   */

  function PagedCollection(sdk, limit) {
    _classCallCheck(this, PagedCollection);

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(PagedCollection).call(this, sdk));

    _this2._limit = limit;

    _this2._currentPage = 0;
    _this2._pageCount = null;
    _this2._total = null;
    _this2._since = null;
    return _this2;
  }

  /**
   * @inheritDoc
   */


  _createClass(PagedCollection, [{
    key: 'hasMore',
    value: function hasMore() {
      return this._currentPage === 0 || this._currentPage < this._pageCount;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: '_parse',


    /**
     * @private
     */
    value: function _parse(serverResponse) {
      if (serverResponse.currentPage > this._currentPage) {
        this._currentPage = serverResponse.currentPage;
      }

      this._pageCount = serverResponse.pageCount;
      this._total = serverResponse.total;
      this._since = serverResponse.since;
    }

    /**
     * Total count of assets available in the database.
     * @type {!number}
     */

  }, {
    key: 'fetchOptions',
    get: function get() {
      var options = _get(Object.getPrototypeOf(PagedCollection.prototype), 'fetchOptions', this);
      options.page = this._currentPage + 1;

      if (this._since) {
        options.since = this._since;
      }

      if (this._limit) {
        options.limit = this._limit;
      }

      return options;
    }
  }, {
    key: 'fetchParser',
    set: function set(parser) {
      _set(Object.getPrototypeOf(PagedCollection.prototype), 'fetchParser', parser, this);
    }

    /**
     * @inheritDoc
     */
    ,
    get: function get() {
      var originalParser = _get(Object.getPrototypeOf(PagedCollection.prototype), 'fetchParser', this);

      var _this = this;
      return function (serverResponse) {
        _this._parse(serverResponse);

        return originalParser ? originalParser(serverResponse) : serverResponse;
      };
    }
  }, {
    key: 'total',
    get: function get() {
      return this._total;
    }
  }]);

  return PagedCollection;
}(_BaseCollection3.default);

exports.default = PagedCollection;