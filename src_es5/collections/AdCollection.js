'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === void 0) { var parent = Object.getPrototypeOf(object); if (parent === null) { return void 0; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === void 0) { return void 0; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseCollection = require('../collections/BaseCollection');
var AdModel = require('../models/AdModel');

// TODO updateAll

var AdCollection = function (_BaseCollection) {
  _inherits(AdCollection, _BaseCollection);

  /**
   * @param {!ChannelModel} event The owning event.
   */

  function AdCollection(event) {
    _classCallCheck(this, AdCollection);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AdCollection).call(this, event.sdk));

    _this.setApiPath('/events/' + event.getProperty('identifier') + '/ads/{adId}');
    return _this;
  }

  /**
   * Parses the response from the server and returns the data to use for model creation.
   *
   * @override
   */


  _createClass(AdCollection, [{
    key: 'parse',
    value: function parse(data) {
      data = _get(Object.getPrototypeOf(AdCollection.prototype), 'parse', this).call(this, data);

      return data.data;
    }

    /**
     * Model method factory.
     */

  }, {
    key: 'createModel',
    value: function createModel() {
      return new AdModel(this.sdk);
    }
  }]);

  return AdCollection;
}(BaseCollection);

module.exports = AdCollection;