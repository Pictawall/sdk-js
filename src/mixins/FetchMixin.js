'use strict';

const StringUtil = require('../util/StringUtil');
const config = require('../services/Config').instance;
const SdkError = require('../core/Errors').SdkError;

if (!window.fetch) {
  require.ensure([], require => {
    require('whatwg-fetch');
  }, 'fetch-polyfill');
}

const apiPaths = new WeakMap();

/**
 * Defines a fetch function that can be used in collections and models.
 *
 * @mixin
 */
const FetchMixin = {

  /**
   * Sets the API endpoint of this model.
   * @param url The path pointing to the endpoint of the rest API with which the model can interact.
   */
  setApiPath(path) {
    apiPaths.set(this, path);
  },

  /**
   * Executes an HTTP GET on the api path of the model and returns the HTTP response as JSON.
   *
   * @returns {Promise.<any>}
   */
  fetchRaw(queryParameters, pathParameters) {
    // TODO use queryParameters
    const endpoint = getEndpoint.call(this, pathParameters);

    return window.fetch(endpoint)
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new SdkError(this, `API responded with http code ${response.status} for endpoint "${endpoint}"`);
        }
      })
      .then(json => this.parse(json));
  },

  parse(data) {
    return data;
  }
};

function getEndpoint(pathParameters) {
  if (!apiPaths.has(this)) {
    throw new SdkError(this, `apiPath has not been set. Use #setApiPath(path)`);
  }

  let apiPath = apiPaths.get(this);
  apiPath = StringUtil.namedFormat(apiPath, pathParameters, true);

  if (apiPath.endsWith('/')) {
    apiPath = apiPath.slice(0, -1);
  }

  return config.get('endpoint') + apiPath;
}

module.exports = FetchMixin;
