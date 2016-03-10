'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseModel = require('./BaseModel');

/**
 * User model.
 */

var UserModel = function (_BaseModel) {
  _inherits(UserModel, _BaseModel);

  /**
   * @param {!Sdk} sdk The instance of the SDK.
   */

  function UserModel(sdk) {
    _classCallCheck(this, UserModel);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(UserModel).call(this, sdk));
  }

  /**
   * Call this method if the owner.avatar url points to a dead link.
   */


  _createClass(UserModel, [{
    key: 'markAvatarAsDead',
    value: function markAvatarAsDead() {
      // TODO NYI
      // PATCH user/id/check
    }
  }]);

  return UserModel;
}(BaseModel);

module.exports = UserModel;