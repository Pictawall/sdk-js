'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === void 0) { var parent = Object.getPrototypeOf(object); if (parent === null) { return void 0; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === void 0) { return void 0; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseCollection = require('./BaseCollection');

var PagedCollection = function (_BaseCollection) {
  _inherits(PagedCollection, _BaseCollection);

  function PagedCollection(sdk, limit, orderBy) {
    _classCallCheck(this, PagedCollection);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PagedCollection).call(this, sdk));

    _this._limit = limit;
    _this._orderBy = orderBy;

    _this._currentPage = 0;
    _this._pageCount = null;
    _this._total = null;
    _this._since = null;
    return _this;
  }

  /**
   * Returns whether or not there is more to be downloaded from the server.
   * @returns {boolean}
   */


  _createClass(PagedCollection, [{
    key: 'hasMore',
    value: function hasMore() {
      return this._currentPage === 0 || this._currentPage < this._pageCount;
    }

    /**
     * @readonly
     */

  }, {
    key: 'parse',
    value: function parse(data) {
      data = _get(Object.getPrototypeOf(PagedCollection.prototype), 'parse', this).call(this, data);

      if (data.currentPage > this._currentPage) {
        this._currentPage = data.currentPage;
      }

      this._pageCount = data.pageCount;
      this._total = data.total;
      this._since = data.since;

      return data;
    }
  }, {
    key: 'fetchOptions',
    get: function get() {
      var options = _get(Object.getPrototypeOf(PagedCollection.prototype), 'fetchOptions', this);
      options.currentPage = this._currentPage + 1;

      if (this._since) {
        options.since = this._since;
      }

      if (this._orderBy) {
        options.order_by = this._orderBy; // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
      }

      options.limit = this._limit;

      return options;
    }
  }]);

  return PagedCollection;
}(BaseCollection);

module.exports = PagedCollection;