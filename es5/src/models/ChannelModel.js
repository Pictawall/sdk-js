'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === void 0) { var parent = Object.getPrototypeOf(object); if (parent === null) { return void 0; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === void 0) { return void 0; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseModel = require('./BaseModel');
var EventModel = require('./EventModel');
var SdkError = require('../core/Errors').SdkError;

/**
 * Model for pictawall channels.
 */

var ChannelModel = function (_BaseModel) {
  _inherits(ChannelModel, _BaseModel);

  /**
   * <p>Creates a new Channel Model, you can fill it with server data by calling {@link #fetch}</p>
   *
   * @param {!Sdk} sdk The SDK in which this model is running.
   * @param {!String} channelId - The pictawall channel identifier.
   */

  function ChannelModel(sdk, channelId) {
    _classCallCheck(this, ChannelModel);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ChannelModel).call(this, sdk));

    if (typeof channelId !== 'string') {
      throw new SdkError(_this, 'Channel identifier "' + channelId + '" is not valid.');
    }

    _this.setApiPath('/channels/' + channelId);
    _this.fetchParser = function (serverResponse) {
      return serverResponse.data;
    };
    return _this;
  }

  /**
   * @inheritDoc
   */


  _createClass(ChannelModel, [{
    key: 'fetch',
    value: function fetch(queryParameters) {
      var _this2 = this;

      return _get(Object.getPrototypeOf(ChannelModel.prototype), 'fetch', this).call(this, queryParameters).then(function () {
        return _this2._event.fetch();
      }).then(function () {
        return _this2;
      });
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'setProperties',
    value: function setProperties(properties) {
      var eventProperties = properties.event;
      this._event = new EventModel(this.sdk, eventProperties.identifier);
      this._event.setProperties(eventProperties);

      return _get(Object.getPrototypeOf(ChannelModel.prototype), 'setProperties', this).call(this, properties);
    }

    /**
     * Returns
     */

  }, {
    key: 'event',
    get: function get() {
      return this._event;
    }
  }]);

  return ChannelModel;
}(BaseModel);

module.exports = ChannelModel;