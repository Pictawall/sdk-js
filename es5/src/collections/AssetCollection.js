'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = void 0; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === void 0) { var parent = Object.getPrototypeOf(object); if (parent === null) { return void 0; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === void 0) { return void 0; } return getter.call(receiver); } };

var _AssetModel = require('../models/AssetModel');

var _AssetModel2 = _interopRequireDefault(_AssetModel);

var _Sdk = require('../core/Sdk');

var _Sdk2 = _interopRequireDefault(_Sdk);

var _Errors = require('../core/Errors');

var _PictawallPagedCollection = require('./abstract/PictawallPagedCollection');

var _PictawallPagedCollection2 = _interopRequireDefault(_PictawallPagedCollection);

var _BaseCollection = require('./abstract/BaseCollection');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * OrderBy value => Asset property mapping.
 */
var SORT_PROPERTIES = {
  display: 'displayCount',
  date: 'postTime',
  likes: 'likeCount'
}; // ['display', 'date', 'likes'];

/**
 * @typedef SortOrder
 * @type Object
 * @property {!string} property - The property of the collection whose values are used to sort.
 * @property {!number} direction - -1 for DESC, 1 for ASC
 */

/**
 * Collection of event assets.
 *
 * @class AssetCollection
 * @extends PictawallPagedCollection
 */

var AssetCollection = function (_PictawallPagedCollec) {
  _inherits(AssetCollection, _PictawallPagedCollec);

  /**
   * @param {!EventModel} event The owning event.
   * @param {object} [fetchOptions = {}] Asset fetch options.
   * @param {number} [fetchOptions.limit = 100] How many assets should be returned by each api call.
   * @param {string} [fetchOptions.orderBy = 'date DESC'] Sort order returned by the API. See API Specifications for possible orders.
   * @param {string} [fetchOptions.kind] Defines the kind of assets the API may return. Comma separated values of asset kinds, See API Specifications for mode details.
   */

  function AssetCollection(event) {
    var _ref = arguments.length <= 1 || arguments[1] === void 0 ? {} : arguments[1];

    var _ref$limit = _ref.limit;
    var limit = _ref$limit === void 0 ? 100 : _ref$limit;
    var _ref$orderBy = _ref.orderBy;
    var orderBy = _ref$orderBy === void 0 ? 'date DESC' : _ref$orderBy;
    var kind = _ref.kind;

    _classCallCheck(this, AssetCollection);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AssetCollection).call(this, event.sdk, limit, orderBy));

    _this._event = event;
    _this.apiPath = '/events/' + event.getProperty('identifier') + '/assets/{modelId}';

    _this._kindFilter = kind;
    _this._orderBy = orderBy;

    if (!/^[a-z]+[_ ](asc|desc)$/i.test(_this._orderBy)) {
      throw new _Errors.SdkError(_this, 'orderBy value "' + _this._orderBy + '" does not match the parameter requirements (/^[a-z]+[_ ](asc|desc)$/i)');
    }

    if (!_this.sortOrder.property) {
      throw new _Errors.SdkError(_this, 'orderBy property should be one of "' + Object.keys(SORT_PROPERTIES).join('", "') + '".');
    }
    return _this;
  }

  /**
   * Returns whether or not the event has a featured asset available.
   *
   * @throws SdkError The event hasn't been populated.
   * @returns {boolean}
   */


  _createClass(AssetCollection, [{
    key: 'hasFeaturedAsset',
    value: function hasFeaturedAsset() {
      var assetId = this._event.getProperty('featuredAssetId');

      if (assetId === void 0) {
        throw new _Errors.SdkError(this, 'Event.featuredAssetId is undefined, make sure the event has been populated.');
      }

      return assetId !== -1;
    }

    /**
     * Returns the sort order.
     *
     * @returns {!SortOrder}
     */

  }, {
    key: 'getFeaturedAsset',


    /**
     * <p>Returns a promise containing the featured tweet if any is available.</p>
     * <p>This method fetches the asset from the server if it does not have it in its local collection.</p>
     * <p>Use {@link #hasFeaturedAsset} to check if this event has a featured asset or not.</p>
     *
     * @throws SdkError The event hasn't been populated.
     * @returns {UserModel}
     */
    value: function getFeaturedAsset() {
      var localResult;
      return regeneratorRuntime.async(function getFeaturedAsset$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (this.hasFeaturedAsset()) {
                _context.next = 2;
                break;
              }

              return _context.abrupt('return', null);

            case 2:
              localResult = this.findOne({ featured: true });

              if (!(localResult != null)) {
                _context.next = 5;
                break;
              }

              return _context.abrupt('return', localResult);

            case 5:
              return _context.abrupt('return', this.fetchById(this._event.getProperty('featuredAssetId')));

            case 6:
            case 'end':
              return _context.stop();
          }
        }
      }, null, this);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'createModel',


    /**
     * @inheritDoc
     */
    value: function createModel() {
      return new _AssetModel2.default(this._event);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: _BaseCollection.Symbols.getUpdatedItems,
    value: function value(since) {
      var _promise$all, _promise$all2, parent, removed;

      return regeneratorRuntime.async(function value$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _promise$all = promise.all([_get(Object.getPrototypeOf(AssetCollection.prototype), _BaseCollection.Symbols.getUpdatedItems, this).call(this, since), this.fetchRaw(Object.assign(this.fetchOptions, { since: since }), { modelId: 'deleted' })]);
              _promise$all2 = _slicedToArray(_promise$all, 2);
              parent = _promise$all2[0];
              removed = _promise$all2[1];


              parent.removed = removed;
              return _context2.abrupt('return', parent);

            case 6:
            case 'end':
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'sortOrder',
    get: function get() {
      var _orderBy$toLowerCase$ = this._orderBy.toLowerCase().split(/[_ ]/);

      var _orderBy$toLowerCase$2 = _slicedToArray(_orderBy$toLowerCase$, 2);

      var property = _orderBy$toLowerCase$2[0];
      var direction = _orderBy$toLowerCase$2[1];

      //noinspection JSValidateTypes

      return { property: SORT_PROPERTIES[property], direction: direction === 'asc' ? 1 : -1 };
    }
  }, {
    key: 'fetchOptions',
    get: function get() {
      var options = _get(Object.getPrototypeOf(AssetCollection.prototype), 'fetchOptions', this);

      if (this._kindFilter) {
        options.kind = this._kindFilter;
      }

      if (this._orderBy) {
        options.order_by = this._orderBy; // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
      }

      return options;
    }
  }]);

  return AssetCollection;
}(_PictawallPagedCollection2.default);

exports.default = AssetCollection;