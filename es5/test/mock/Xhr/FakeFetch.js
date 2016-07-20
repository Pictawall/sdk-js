'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = void 0; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ = require('lodash');
var qs = require('qs-lite');

var mockedRoutes = [];

var FakeResponse = function () {
  function FakeResponse(body, status) {
    _classCallCheck(this, FakeResponse);

    this.body = body;
    this.ok = Math.floor(status / 100) === 2;
    this.status = status;
  }

  _createClass(FakeResponse, [{
    key: 'json',
    value: function json() {
      return Promise.resolve(JSON.parse(this.body));
    }
  }]);

  return FakeResponse;
}();

module.exports = {
  fetch: function fetch(requestPath) {
    var _requestPath$split = requestPath.split('?');

    var _requestPath$split2 = _slicedToArray(_requestPath$split, 2);

    var path = _requestPath$split2[0];
    var queryString = _requestPath$split2[1];

    // TODO replace qs with URL

    var queryParameters = qs.parse(queryString);

    var route = mockedRoutes.find(function (mockedRoute) {
      if (mockedRoute.path instanceof RegExp) {
        if (!mockedRoute.path.test(path)) {
          return false;
        }
      } else {
        if (mockedRoute.path !== path) {
          return false;
        }
      }

      return _.isEqual(queryParameters, mockedRoute.queryParameters);
    });

    if (route == null) {
      return Promise.reject('No path found for ' + requestPath);
    }

    return Promise.resolve(route.response);
  },
  mockRoute: function mockRoute(_ref, _ref2) {
    var path = _ref.path;
    var _ref$queryParameters = _ref.queryParameters;
    var queryParameters = _ref$queryParameters === void 0 ? {} : _ref$queryParameters;
    var _ref2$body = _ref2.body;
    var body = _ref2$body === void 0 ? '' : _ref2$body;
    var _ref2$status = _ref2.status;
    var status = _ref2$status === void 0 ? 200 : _ref2$status;

    mockedRoutes.push({
      path: path,
      queryParameters: queryParameters,
      response: new FakeResponse(body, status)
    });
  },


  FakeResponse: FakeResponse
};