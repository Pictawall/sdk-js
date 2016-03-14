'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === void 0) { var parent = Object.getPrototypeOf(object); if (parent === null) { return void 0; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === void 0) { return void 0; } return getter.call(receiver); } };

var _BaseModel2 = require('./BaseModel');

var _BaseModel3 = _interopRequireDefault(_BaseModel2);

var _AssetCollection = require('../collections/AssetCollection');

var _AssetCollection2 = _interopRequireDefault(_AssetCollection);

var _UserCollection = require('../collections/UserCollection');

var _UserCollection2 = _interopRequireDefault(_UserCollection);

var _AdCollection = require('../collections/AdCollection');

var _AdCollection2 = _interopRequireDefault(_AdCollection);

var _MessageCollection = require('../collections/MessageCollection');

var _MessageCollection2 = _interopRequireDefault(_MessageCollection);

var _Errors = require('../core/Errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Model for pictawall events.
 *
 * @class EventModel
 * @extends BaseModel
 */

var EventModel = function (_BaseModel) {
  _inherits(EventModel, _BaseModel);

  /**
   * <p>Creates a new Event model and its associated collections.</p>
   * <p>You can fill it with server data by calling {@link #fetch}</p>
   *
   * @param {!Sdk} sdk - The SDK in which this model is running.
   * @param {!String} identifier - The pictawall event identifier.
   * @param {!Object} config - The constructor parameters.
   * @param {!boolean} [config.autoUpdate = false] - Should the collections periodically fetch their contents ?
   * @param {!number} [config.autoUpdateVelocity = 10000] - Time in ms between each auto-update.
   */

  function EventModel(sdk, identifier) {
    var _ref = arguments.length <= 2 || arguments[2] === void 0 ? {} : arguments[2];

    var _ref$autoUpdate = _ref.autoUpdate;
    var /* config = */autoUpdate = _ref$autoUpdate === void 0 ? false : _ref$autoUpdate;
    var _ref$autoUpdateVeloci = _ref.autoUpdateVelocity;
    var autoUpdateVelocity = _ref$autoUpdateVeloci === void 0 ? 10000 : _ref$autoUpdateVeloci;
    var _ref$assetBatchSize = _ref.assetBatchSize;
    var assetBatchSize = _ref$assetBatchSize === void 0 ? 100 : _ref$assetBatchSize;

    _classCallCheck(this, EventModel);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(EventModel).call(this, sdk));

    if (typeof identifier !== 'string') {
      throw new _Errors.SdkError(_this, 'Event identifier "' + identifier + '" is not valid.');
    }

    //this.autoUpdateVelocity = autoUpdateVelocity;

    _this.setProperty('identifier', identifier);
    _this.apiPath = '/events/' + identifier;
    _this.fetchParser = function (serverResponse) {
      return serverResponse.data;
    };

    _this.userCollection = new _UserCollection2.default(_this);
    _this.assetCollection = new _AssetCollection2.default(_this, assetBatchSize);
    _this.adCollection = new _AdCollection2.default(_this);
    _this.messageCollection = new _MessageCollection2.default(_this);
    return _this;
  }

  /**
   * @inheritDoc
   */


  _createClass(EventModel, [{
    key: 'fetch',
    value: function fetch(queryParameters) {
      var _this2 = this;

      return Promise.all([_get(Object.getPrototypeOf(EventModel.prototype), 'fetch', this).call(this, queryParameters), this.userCollection.fetch(), this.assetCollection.fetch(), this.adCollection.fetch(), this.messageCollection.fetch()]).then(function () {
        //if (autoUpdate) {
        //  this.startAutoUpdate();
        //}

        return _this2;
      });
    }

    //_runAutoUpdate() {
    //  if (!this._autoUpdate){
    //    return;
    //  }
    //
    //  this.update().then(() => {
    //    setTimeout(() => this._runAutoUpdate(), this.autoUpdateVelocity);
    //  });
    //}

    //updateAll() {
    //  return Promise.all([
    //    this.fetch(),
    //    this.assetCollection.loadMore()
    //  ]);
    //}
    //
    //stopAutoUpdate() {
    //  this._autoUpdate = false;
    //}
    //
    //startAutoUpdate() {
    //  this._autoUpdate = true;
    //  this._runAutoUpdate();
    //}

  }]);

  return EventModel;
}(_BaseModel3.default);

exports.default = EventModel;