'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === void 0) { var parent = Object.getPrototypeOf(object); if (parent === null) { return void 0; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === void 0) { return void 0; } return getter.call(receiver); } };

var _PictawallModel2 = require('./abstract/PictawallModel');

var _PictawallModel3 = _interopRequireDefault(_PictawallModel2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * User model.
 *
 * @class UserModel
 * @extends PictawallModel
 */

var UserModel = function (_PictawallModel) {
  _inherits(UserModel, _PictawallModel);

  /**
   * @param {!EventModel} event The event this user is creating content for.
   */

  function UserModel(event) {
    _classCallCheck(this, UserModel);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(UserModel).call(this, event.sdk));

    _this._event = event;
    _this.parseResponse = function (data) {
      return data.data;
    };
    return _this;
  }

  /**
   * @inheritDoc
   */


  _createClass(UserModel, [{
    key: 'setProperties',
    value: function setProperties(properties) {
      this.apiPath = '/events/' + this._event.getProperty('identifier') + '/users/' + properties.id;

      return _get(Object.getPrototypeOf(UserModel.prototype), 'setProperties', this).call(this, properties);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'setProperty',
    value: function setProperty(name, value) {
      if (name === 'id') {
        this.apiPath = '/events/' + this._event.getProperty('identifier') + '/users/' + value;
      }

      _get(Object.getPrototypeOf(UserModel.prototype), 'setProperty', this).call(this, name, value);
    }

    /**
     * Call this method if the owner.avatar url points to a dead link.
     *
     * @returns {!Promise.<this>}
     */

  }, {
    key: 'markAvatarAsDead',
    value: function markAvatarAsDead() {
      var _this2 = this;

      return this.sdk.callApi(this.apiPath + '/check', { method: 'PATCH' }).then(function () {
        return _this2;
      });
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'type',
    get: function get() {
      return 'user';
    }
  }]);

  return UserModel;
}(_PictawallModel3.default);

exports.default = UserModel;