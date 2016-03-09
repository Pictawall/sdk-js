'use strict';

const StringUtil = require('../util/StringUtil');
const SdkError = require('../core/Errors').SdkError;

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
   *
   * @instance
   */
  setApiPath(path) {
    apiPaths.set(this, path);
  },

  /**
   * Executes an HTTP GET on the api path of the model and returns the HTTP response as JSON.
   *
   * @returns {Promise.<any>}
   *
   * @instance
   */
  fetchRaw(queryParameters, pathParameters) {
    const endpoint = getEndpoint.call(this, pathParameters);

    return window.fetch(endpoint + StringUtil.buildQueryParameters(queryParameters))
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new SdkError(this, `API responded with http code ${response.status} for endpoint "${endpoint}"`);
        }
      })
      .then(json => this.parse(json));
  },

  /**
   * Parses the data retrieve by {@link fetchRaw}.
   * Overwrite this method if you the data to use for the model / collection is not directly at the top level.
   *
   * @param {any} data The data from the API call, parsed as JSON.
   * @returns {any} The data to use for the model / collection.
   *
   * @instance
   */
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

  return this.sdk.config.get('endpoint') + apiPath;
}

module.exports = FetchMixin;
