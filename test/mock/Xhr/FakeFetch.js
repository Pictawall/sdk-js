'use strict';

const _ = require('lodash');
const qs = require('qs-lite');

const mockedRoutes = [];

class FakeResponse {
  constructor(body, status) {
    this.body = body;
    this.ok = Math.floor(status / 100) === 2;
    this.status = status;
  }

  json() {
    return Promise.resolve(JSON.parse(this.body));
  }
}

module.exports = {
  fetch(requestPath) {
    const [path, queryString] = requestPath.split('?');

    // TODO replace qs with URL
    const queryParameters = qs.parse(queryString);

    const route = mockedRoutes.find(mockedRoute => {
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

  mockRoute({ path, queryParameters = {} }, { body = '', status = 200 }) {
    mockedRoutes.push({
      path,
      queryParameters,
      response: new FakeResponse(body, status)
    });
  },

  FakeResponse: FakeResponse
};
