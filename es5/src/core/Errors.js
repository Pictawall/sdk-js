'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ApiError = exports.NetworkError = exports.SdkError = exports.PictawallError = void 0;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
 *
 * @property {Error} previousException - The exception that caused this one.
 * @property {*} thrower - The instance which throwed the exception.
 */
var PictawallError = exports.PictawallError = function (_Error) {
  _inherits(PictawallError, _Error);

  /**
   * @param {*} thrower - The thrower of this error.
   * @param {!(String|Error)} message - A message to display.
   * @param {!(Error|String)} [previousException] - The previous error message.
   */
  function PictawallError(thrower, message, previousException) {
    _classCallCheck(this, PictawallError);

    if ((typeof message === 'undefined' ? 'undefined' : _typeof(message)) === 'object' || typeof previousException === 'string') {
      var tmp = previousException;
      previousException = message;
      message = tmp;
    }

    if (!message) {
      message = '<No Message Specified>';
    }

    var _this = _possibleConstructorReturn(this, (PictawallError.__proto__ || Object.getPrototypeOf(PictawallError)).call(this, '[' + _ClassUtil2.default.getName(thrower) + '] ' + message));

    _ClassUtil2.default.defineFinal(_this, 'thrower', thrower);
    _ClassUtil2.default.defineFinal(_this, 'previousException', previousException);
    return _this;
  }

  return PictawallError;
}(Error);

PictawallError.prototype.name = 'PictawallError';

/**
 * Error to use for internal SDK errors.
 *
 * @class SdkError
 * @extends PictawallError
 */

var SdkError = exports.SdkError = function (_PictawallError) {
  _inherits(SdkError, _PictawallError);

  function SdkError() {
    var _ref;

    _classCallCheck(this, SdkError);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _possibleConstructorReturn(this, (_ref = SdkError.__proto__ || Object.getPrototypeOf(SdkError)).call.apply(_ref, [this].concat(args)));
  }

  return SdkError;
}(PictawallError);

SdkError.prototype.name = 'SdkError';

/**
 * Error to use for connectivity problems.
 *
 * @class NetworkError
 * @extends PictawallError
 */

var NetworkError = exports.NetworkError = function (_PictawallError2) {
  _inherits(NetworkError, _PictawallError2);

  function NetworkError() {
    var _ref2;

    _classCallCheck(this, NetworkError);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _possibleConstructorReturn(this, (_ref2 = NetworkError.__proto__ || Object.getPrototypeOf(NetworkError)).call.apply(_ref2, [this].concat(args)));
  }

  return NetworkError;
}(PictawallError);

NetworkError.prototype.name = 'NetworkError';

/**
 * Error to use for connectivity problems.
 *
 * @class ApiError
 * @extends NetworkError
 * @property {!Response} response - The fetch response.
 */

var ApiError = exports.ApiError = function (_NetworkError) {
  _inherits(ApiError, _NetworkError);

  /**
   * @param {*} thrower
   * @param {!(String|Error)} message
   * @param {!Response} response
   * @param {!(String|Error)} [previousException]
   */
  function ApiError(thrower, message, response, previousException) {
    _classCallCheck(this, ApiError);

    var _this4 = _possibleConstructorReturn(this, (ApiError.__proto__ || Object.getPrototypeOf(ApiError)).call(this, thrower, message, previousException));

    _ClassUtil2.default.defineFinal(_this4, 'response', response);
    return _this4;
  }

  return ApiError;
}(NetworkError);

ApiError.prototype.name = 'ApiError';