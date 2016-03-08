'use strict';

const stubbedRequests = [];

const originalFetch = window.fetch;

const fakeFetch = function (path, ...args) {

  for (let stubbedRequest of stubbedRequests) {
    if (stubbedRequest.pathRegex.test(path)) {
      return Promise.resolve(new window.Response(...stubbedRequest.response));
    }
  }

  console.warn('No mock path found for ' + path);
  return originalFetch(path, ...args);
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
