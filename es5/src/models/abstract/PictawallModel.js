'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Errors = require('../../core/Errors');

var _BaseModel2 = require('./BaseModel');

var _BaseModel3 = _interopRequireDefault(_BaseModel2);

var _FetchMixin = require('../../mixins/FetchMixin');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @class PictawallModel
 * @extends BaseModel
 */
var PictawallModel = function (_BaseModel) {
  _inherits(PictawallModel, _BaseModel);

  /**
   * @param {!Sdk} sdk The SDK in which this model is running.
   */
  function PictawallModel(sdk) {
    _classCallCheck(this, PictawallModel);

    return _possibleConstructorReturn(this, (PictawallModel.__proto__ || Object.getPrototypeOf(PictawallModel)).call(this, sdk));
  }

  /**
   * Returns the identifier of the model.
   * @returns {*}
   */


  _createClass(PictawallModel, [{
    key: _FetchMixin.Symbols.parseResponse,


    /**
     * @inheritDoc
     */
    value: function value(response) {
      return response.data;
    }
  }, {
    key: 'id',
    get: function get() {
      var id = this.getProperty('id');

      if (!id) {
        throw new _Errors.SdkError(this, 'This model does not have an ID.');
      }

      return id;
    }
  }]);

  return PictawallModel;
}(_BaseModel3.default);

exports.default = PictawallModel;