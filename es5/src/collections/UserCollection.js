'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _PagedCollection2 = require('./PagedCollection');

var _PagedCollection3 = _interopRequireDefault(_PagedCollection2);

var _UserModel = require('../models/UserModel');

var _UserModel2 = _interopRequireDefault(_UserModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// TODO updateAll
// TODO handle scores

/**
 * Collection of event users.
 *
 * @class UserCollection
 * @extends PagedCollection
 */

var UserCollection = function (_PagedCollection) {
  _inherits(UserCollection, _PagedCollection);

  /**
   * @param {!EventModel} event The owning event.
   */

  function UserCollection(event) {
    _classCallCheck(this, UserCollection);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(UserCollection).call(this, event.sdk, 5, 'score'));

    _this._event = event;
    _this.apiPath = '/events/' + event.getProperty('identifier') + '/users/{userId}';
    _this.fetchParser = function (data) {
      return data.data;
    };
    return _this;
  }

  /**
   * @inheritDoc
   */


  _createClass(UserCollection, [{
    key: 'add',
    value: function add(newModel) {
      var replace = arguments.length <= 1 || arguments[1] === void 0 ? true : arguments[1];
      var persist = arguments.length <= 2 || arguments[2] === void 0 ? true : arguments[2];

      var index = this._models.findIndex(function (model) {
        return model.getProperty('id') === newModel.getProperty('id');
      });

      if (index === -1) {
        this._models.push(newModel);
        return newModel;
      }

      if (replace) {
        this._models[index] = newModel;
        return newModel;
      } else {
        return this._models[index];
      }
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'createModel',
    value: function createModel() {
      return new _UserModel2.default(this._event);
    }
  }]);

  return UserCollection;
}(_PagedCollection3.default);

exports.default = UserCollection;