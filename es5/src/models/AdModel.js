'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BaseModel2 = require('./BaseModel');

var _BaseModel3 = _interopRequireDefault(_BaseModel2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Advertisement model.
 *
 * @class AdModel
 * @extends BaseModel
 */

var AdModel = function (_BaseModel) {
  _inherits(AdModel, _BaseModel);

  /**
   * @param {!Sdk} sdk The instance of the SDK.
   */

  function AdModel(sdk) {
    _classCallCheck(this, AdModel);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(AdModel).call(this, sdk));
  }

  return AdModel;
}(_BaseModel3.default);

exports.default = AdModel;