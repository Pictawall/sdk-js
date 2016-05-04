'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseModel2 = require('./BaseModel');

var _BaseModel3 = _interopRequireDefault(_BaseModel2);

var _Errors = require('../core/Errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @type {WeakMap.<EventModel, Map.<String, BaseCollection>>}
 */
var collectionLists = new WeakMap();

/**
 * Model for pictawall events.
 *
 * @class EventModel
 * @extends BaseModel
 */

var EventModel = function (_BaseModel) {
  _inherits(EventModel, _BaseModel);

  /**
   * <p>Creates a new Event model.</p>
   * <p>You can fill it with server data by calling {@link #fetch}</p>
   *
   * @param {!Sdk} sdk - The SDK in which this model is running.
   * @param {!String} identifier - The pictawall event identifier.
   * @param {Object} config - The constructor parameters.
   * @param {boolean} [config.autoUpdate = false] - Should the collections periodically fetch their contents ?
   * @param {number} [config.autoUpdateVelocity = 10000] - Time in ms between each auto-update.
   */

  function EventModel(sdk, identifier) {
    var _ref = arguments.length <= 2 || arguments[2] === void 0 ? {} : arguments[2];

    var _ref$autoUpdate = _ref.autoUpdate;
    var /* config = */autoUpdate = _ref$autoUpdate === void 0 ? false : _ref$autoUpdate;
    var _ref$autoUpdateVeloci = _ref.autoUpdateVelocity;
    var autoUpdateVelocity = _ref$autoUpdateVeloci === void 0 ? 10000 : _ref$autoUpdateVeloci;

    _classCallCheck(this, EventModel);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(EventModel).call(this, sdk));

    if (typeof identifier !== 'string' || !/^[a-z0-9\-_]+$/i.test(identifier)) {
      throw new _Errors.SdkError(_this, 'Event identifier "' + identifier + '" is not valid.');
    }

    //this.autoUpdateVelocity = autoUpdateVelocity;

    _this.setProperty('identifier', identifier);
    _this.apiPath = '/events/' + identifier;
    _this.fetchParser = function (serverResponse) {
      return serverResponse.data;
    };

    collectionLists.set(_this, new Map());
    return _this;
  }

  _createClass(EventModel, [{
    key: 'fetchCollections',
    value: function fetchCollections() {
      var promises = [];

      collectionLists.get(this).forEach(function (collection) {
        promises.push(collection.fetch());
      });

      return Promise.all(promises);
    }

    /**
     * <p>Adds a collection to this model.</p>
     * <p>Collections aren't automatically added to give you more control on the collections themselves.</p>
     *
     * @param {!String} collectionName
     * @param {!BaseCollection} collection
     * @return {!this}
     *
     * @example
     * // split media and text assets in two different collections
     * event.addCollection('assetTextCollection', new AssetCollection(event, { limit: 100, orderBy: 'date_desc', kind: 'text' }))
     * event.addCollection('assetMediaCollection', new AssetCollection(event, { limit: 100, orderBy: 'date_desc', kind: 'text' }))
     */

  }, {
    key: 'addCollection',
    value: function addCollection(collectionName, collection) {
      var collectionList = collectionLists.get(this);

      if (collectionList.has(collectionName)) {
        throw new _Errors.SdkError(this, 'Collection ' + collectionName + ' already registered for this event');
      }

      collectionList.set(collectionName, collection);

      return this;
    }
  }, {
    key: 'getCollection',
    value: function getCollection(collectionName) {
      var collectionList = collectionLists.get(this);

      return collectionList.get(collectionName);
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

    /**
     * @inheritDoc
     */

  }, {
    key: 'type',
    get: function get() {
      return 'event';
    }
  }]);

  return EventModel;
}(_BaseModel3.default);

exports.default = EventModel;