'use strict';

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
    const route = mockedRoutes.find(mockedRoute => {
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

  mockRoute(path, { body = '', status = 200 }) {
    mockedRoutes.push({
      path,
      response: new FakeResponse(body, status)
    });
  }
};
