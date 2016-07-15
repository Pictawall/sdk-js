'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SdkError = exports.PictawallError = void 0;

var _ClassUtil = require('../util/ClassUtil');

var _ClassUtil2 = _interopRequireDefault(_ClassUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Error that prints the name of the class of the thrower.
 *
 * @class PictawallError
 * @extends Error
 */

var PictawallError = exports.PictawallError = function (_Error) {
  _inherits(PictawallError, _Error);

  /**
   * @param {*} thrower - The thrower of this error.
   * @param {!String} message - A message to display.
   * @param [errorArgs] errorArgs - The list of args to pass to the Error constructor after the message parameter.
   */

  function PictawallError(thrower, message) {
    var _Object$getPrototypeO;

    _classCallCheck(this, PictawallError);

    for (var _len = arguments.length, errorArgs = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      errorArgs[_key - 2] = arguments[_key];
    }

    var _this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(PictawallError)).call.apply(_Object$getPrototypeO, [this, '[' + _ClassUtil2.default.getName(thrower) + '] ' + message].concat(errorArgs)));

    _this.name = _this.constructor.name;
    return _this;
  }

  return PictawallError;
}(Error);

/**
 * Error to use for internal SDK errors.
 *
 * @class SdkError
 * @extends PictawallError
 */


var SdkError = exports.SdkError = function (_PictawallError) {
  _inherits(SdkError, _PictawallError);

  function SdkError() {
    var _Object$getPrototypeO2;

    _classCallCheck(this, SdkError);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _possibleConstructorReturn(this, (_Object$getPrototypeO2 = Object.getPrototypeOf(SdkError)).call.apply(_Object$getPrototypeO2, [this].concat(args)));
  }

  return SdkError;
}(PictawallError);