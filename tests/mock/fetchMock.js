'use strict';

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
    window.fetch = fakeFetch;
  },

  uninstall() {
    window.fetch = originalFetch;
  },

  stubRequest(pathRegex, response) {
    stubbedRequests.push({
      pathRegex,
      response: [response.responseText, {
        status: response.status || 200
      }]
    });
  }
};
