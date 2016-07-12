'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Sdk = require('../core/Sdk');

var _Sdk2 = _interopRequireDefault(_Sdk);

var _Errors = require('../core/Errors');

var _PictawallModel2 = require('./abstract/PictawallModel');

var _PictawallModel3 = _interopRequireDefault(_PictawallModel2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @type {WeakMap.<EventModel, {
 *  collections: Map.<String, BaseCollection>,
 *  autoUpdate: boolean,
 *  autoUpdateTimeout: number
 * }>}
 */
var properties = new WeakMap();

/**
 * @param {!EventModel} self
 * @private
 */
function _runAutoUpdate(self) {
  var props = properties.get(self);
  if (!props.autoUpdate) {
    return;
  }

  props.autoUpdateTimeout = void 0;

  self.updateCollections().then(function () {
    props.autoUpdateTimeout = setTimeout(function () {
      return _runAutoUpdate(self);
    }, self.autoUpdateVelocity);
  });
}

/**
 * Model for pictawall events.
 *
 * @class EventModel
 * @extends PictawallModel
 */

var EventModel = function (_PictawallModel) {
  _inherits(EventModel, _PictawallModel);

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
    var autoUpdateVelocity = _ref$autoUpdateVeloci === void 0 ? 15000 : _ref$autoUpdateVeloci;

    _classCallCheck(this, EventModel);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(EventModel).call(this, sdk));

    if (typeof identifier !== 'string' || !/^[a-z0-9\-_]+$/i.test(identifier)) {
      throw new _Errors.SdkError(_this, 'Event identifier "' + identifier + '" is not valid.');
    }

    _this.setProperty('identifier', identifier);
    _this.apiPath = '/events/' + identifier;

    _this.autoUpdateVelocity = autoUpdateVelocity;

    properties.set(_this, {
      collections: new Map(),
      autoUpdate: autoUpdate
    });
    return _this;
  }

  _createClass(EventModel, [{
    key: 'fetchCollections',
    value: function fetchCollections() {
      var promises = [];

      properties.get(this).collections.forEach(function (collection) {
        promises.push(collection.fetch());
      });

      return _Sdk2.default.Promise.all(promises);
    }

    /**
     * <p>Adds a collection to this model.</p>
     * <p>Collections aren't automatically added to give you more control on the collections themselves.</p>
     *
     * @param {!String} collectionName
     * @param {!BaseCollection} collection
     * @return {!EventModel}
     *
     * @example
     * // split media and text assets in two different collections
     * event.addCollection('assetTextCollection', new AssetCollection(event, { limit: 100, orderBy: 'date_desc', kind: 'text' }))
     * event.addCollection('assetMediaCollection', new AssetCollection(event, { limit: 100, orderBy: 'date_desc', kind: 'text' }))
     */

  }, {
    key: 'addCollection',
    value: function addCollection(collectionName, collection) {
      var collectionList = properties.get(this).collections;

      if (collectionList.has(collectionName)) {
        throw new _Errors.SdkError(this, 'Collection ' + collectionName + ' already registered for this event');
      }

      collectionList.set(collectionName, collection);

      return this;
    }
  }, {
    key: 'getCollection',
    value: function getCollection(collectionName) {
      return properties.get(this).collections.get(collectionName);
    }
  }, {
    key: 'updateCollections',
    value: function updateCollections() {
      var props = properties.get(this);

      var promises = [];
      props.collections.forEach(function (collection) {
        return promises.push(collection.update());
      });

      return Promise.all(promises);
    }
  }, {
    key: 'autoUpdate',
    set: function set(autoUpdate) {
      autoUpdate = !!autoUpdate;

      var props = properties.get(this);
      if (props.autoUpdate === autoUpdate) {
        return;
      }

      props.autoUpdate = autoUpdate;

      if (!autoUpdate) {
        if (props.autoUpdateTimeout) {
          clearTimeout(props.autoUpdateTimeout);
          props.autoUpdateTimeout = void 0;
        }
      } else {
        _runAutoUpdate(this);
      }
    },
    get: function get() {
      return properties.get(this).autoUpdate;
    }

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
}(_PictawallModel3.default);

exports.default = EventModel;