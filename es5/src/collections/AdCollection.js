'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AdModel = require('../models/AdModel');

var _AdModel2 = _interopRequireDefault(_AdModel);

var _PictawallCollection2 = require('./abstract/PictawallCollection');

var _PictawallCollection3 = _interopRequireDefault(_PictawallCollection2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Collection of event ads.
 *
 * @class AdCollection
 * @extends PictawallCollection
 */

var AdCollection = function (_PictawallCollection) {
  _inherits(AdCollection, _PictawallCollection);

  /**
   * @param {!EventModel} event The owning event.
   */

  function AdCollection(event) {
    _classCallCheck(this, AdCollection);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AdCollection).call(this, event.sdk));

    _this.apiPath = '/events/' + event.getProperty('identifier') + '/ads/{modelId}';
    return _this;
  }

  /**
   * @inheritDoc
   */


  _createClass(AdCollection, [{
    key: 'createModel',
    value: function createModel() {
      return new _AdModel2.default(this.sdk);
    }
  }]);

  return AdCollection;
}(_PictawallCollection3.default);

exports.default = AdCollection;