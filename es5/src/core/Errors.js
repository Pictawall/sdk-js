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
   * @param {*} thrower The thrower of this error.
   * @param {!String} message A message to display.
   * @param {string} [filename] The filename in which the error occurred.
   * @param {number} [lineNumber] The line at which the error occurred.
   */

  function PictawallError(thrower, message, filename, lineNumber) {
    _classCallCheck(this, PictawallError);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PictawallError).call(this, '[' + _ClassUtil2.default.getName(thrower) + '] ' + message, filename, lineNumber));

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
    var _Object$getPrototypeO;

    _classCallCheck(this, SdkError);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(SdkError)).call.apply(_Object$getPrototypeO, [this].concat(args)));
  }

  return SdkError;
}(PictawallError);