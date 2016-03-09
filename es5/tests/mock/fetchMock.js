'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var BrowserShim = require('../../src/core/BrowserShim');

var stubbedRequests = [];

var originalFetch = BrowserShim.fetch;

var fakeFetch = function fakeFetch(path) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;

  var _iteratorError = void 0;

  try {

    for (var _iterator = stubbedRequests[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var stubbedRequest = _step.value;

      if (stubbedRequest.pathRegex.test(path)) {
        return Promise.resolve(new (Function.prototype.bind.apply(BrowserShim.Response, [null].concat(_toConsumableArray(stubbedRequest.response))))());
      }
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

  throw new Error('No mock path found for ' + path);
};

module.exports = {
  install: function install() {
    BrowserShim.fetch = fakeFetch;
  },
  uninstall: function uninstall() {
    BrowserShim.fetch = originalFetch;
  },
  stubRequest: function stubRequest(pathRegex, response) {
    stubbedRequests.push({
      pathRegex: pathRegex,
      response: [response.responseText, {
        status: response.status || 200
      }]
    });
  }
};