'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === void 0) { var parent = Object.getPrototypeOf(object); if (parent === null) { return void 0; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === void 0) { return void 0; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseModel = require('./BaseModel');
var SdkError = require('../core/Errors').SdkError;

var AssetModel = function (_BaseModel) {
  _inherits(AssetModel, _BaseModel);

  /**
   * @param {ChannelModel} event The owning event model.
   */

  function AssetModel(event) {
    _classCallCheck(this, AssetModel);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AssetModel).call(this, event.sdk));

    if ((typeof event === 'undefined' ? 'undefined' : _typeof(event)) !== 'object') {
      throw new SdkError(_this, 'event must be an EventModel.');
    }

    /**
     * @type {ChannelModel}
     */
    _this._event = event;
    return _this;
  }

  _createClass(AssetModel, [{
    key: 'setProperties',
    value: function setProperties(properties) {
      // hotfix api bug, thx php.
      if (Array.isArray(properties.source.additionalData)) {
        properties.source.additionalData = {};
      }

      var userCollection = this._event.userCollection;
      this._owner = userCollection.findOne({ id: properties.owner.id });
      if (this._owner === null) {
        var owner = userCollection.createModel(properties.owner);
        owner.setProperties(properties.owner);

        this._owner = userCollection.add(owner, false, false);
      }

      this.setApiPath('/events/' + this._event.identifier + '/assets/' + properties.id);

      return _get(Object.getPrototypeOf(AssetModel.prototype), 'setProperties', this).call(this, properties);
    }

    /**
     * @return {!UserModel}
     */

  }, {
    key: 'markMediaAsDead',


    /**
     * Call this method if the media.default url points to a dead link.
     *
     * @memberOf UserModel
     * @instance
     */
    value: function markMediaAsDead() {}
    // TODO NYI
    // PATCH assets/id/check/


    /**
     * Report the asset for moderation.
     *
     * @memberOf UserModel
     * @instance
     */

  }, {
    key: 'report',
    value: function report() {
      if (this.getProperty('isSafe')) {
        return;
      }

      // TODO NYI
      // PATCH assets/id/report
    }
  }, {
    key: 'owner',
    get: function get() {
      return this._owner;
    }
  }]);

  return AssetModel;
}(BaseModel);

module.exports = AssetModel;