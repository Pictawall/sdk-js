'use strict';

const hasNativeFetch = !!window.fetch;

const stubbedRequests = [];

const originalFetch = window.fetch;

const fakeFetch = function (path) {

  for (let stubbedRequest of stubbedRequests) {
    if (stubbedRequest.pathRegex.test(path)) {
      return Promise.resolve(new window.Response(...stubbedRequest.response));
    }
  }

  throw new Error('No mock path found for ' + path);
};

module.exports = {
  install() {
    if (!hasNativeFetch) {
      return;
    }

    window.fetch = fakeFetch;
  },

  uninstall() {
    if (!hasNativeFetch) {
      return;
    }

    window.fetch = originalFetch;
  },

  stubRequest(pathRegex, response) {
    if (!hasNativeFetch) {
      return;
    }

    stubbedRequests.push({
      pathRegex,
      response: [response.responseText, {
        status: response.status || 200
      }]
    });
  }
};
