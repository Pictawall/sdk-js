'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
    var route = mockedRoutes.find(function (mockedRoute) {
      if (mockedRoute.path instanceof RegExp) {
        return mockedRoute.path.test(requestPath);
      }

      return mockedRoute.path === requestPath;
    });

    if (route == null) {
      return Promise.reject('No path found for ' + requestPath);
    }

    return Promise.resolve(route.response);
  },
  mockRoute: function mockRoute(path, _ref) {
    var _ref$body = _ref.body;
    var body = _ref$body === void 0 ? '' : _ref$body;
    var _ref$status = _ref.status;
    var status = _ref$status === void 0 ? 200 : _ref$status;

    mockedRoutes.push({
      path: path,
      response: new FakeResponse(body, status)
    });
  }
};