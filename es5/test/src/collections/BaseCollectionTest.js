'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseModel = require('../../../src/models/BaseModel');

var _BaseModel2 = _interopRequireDefault(_BaseModel);

var _BaseCollection2 = require('../../../src/collections/BaseCollection');

var _BaseCollection3 = _interopRequireDefault(_BaseCollection2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ClassMock = require('../../mock/ClassMock');
var XhrMock = require('../../mock/XhrMock');

var FakeCollection = function (_BaseCollection) {
  _inherits(FakeCollection, _BaseCollection);

  function FakeCollection(sdk) {
    _classCallCheck(this, FakeCollection);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FakeCollection).call(this, sdk));

    _this.apiPath = '/events/' + XhrMock.VALID_IDENTIFIER + '/ads';
    _this.fetchParser = function (data) {
      return data.data;
    };
    return _this;
  }

  _createClass(FakeCollection, [{
    key: 'createModel',
    value: function createModel() {
      return new _BaseModel2.default(this.sdk);
    }
  }]);

  return FakeCollection;
}(_BaseCollection3.default);

describe('BaseCollection', function () {

  describe('fetch', function () {
    var collection = new FakeCollection(ClassMock.sdk);

    it('populates the collection with the data from the API', function () {
      expect(collection.loaded).toBe(false);
      expect(collection.hasMore).toBe(true);

      var fetchPromise = collection.fetch();
      expect(fetchPromise).toEqual(jasmine.any(Promise));

      fetchPromise.then(function (_collection) {
        expect(_collection).toBe(collection);
        expect(collection.loaded).toBe(true);
        expect(collection.hasMore).toBe(false);

        var source = XhrMock.VALID_EVENT_ADS.data;
        expect(collection.length).toBe(source.length, 'Collection size does not match source size');

        for (var i = 0; i < source.length; i++) {
          var remoteModel = source[i];
          var localModel = collection.findOne({ id: remoteModel.id });

          expect(localModel).toBeDefined();

          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;

          var _iteratorError = void 0;

          try {
            for (var _iterator = Object.getOwnPropertyNames(remoteModel)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var propertyName = _step.value;

              expect(localModel.getProperty(propertyName)).toEqual(remoteModel[propertyName]);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }
      });
    });
  });
});