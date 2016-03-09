'use strict';

var StringUtil = require('../util/StringUtil');
var SdkError = require('../core/Errors').SdkError;
var BrowserShim = require('../core/BrowserShim');

var apiPaths = new WeakMap();

/**
 * Defines a fetch function that can be used in collections and models.
 *
 * @mixin
 */
var FetchMixin = {

  /**
   * Sets the API endpoint of this model.
   * @param url The path pointing to the endpoint of the rest API with which the model can interact.
   *
   * @instance
   */

  setApiPath: function setApiPath(path) {
    apiPaths.set(this, path);
  },


  /**
   * Executes an HTTP GET on the api path of the model and returns the HTTP response as JSON.
   *
   * @returns {Promise.<any>}
   *
   * @instance
   */
  fetchRaw: function fetchRaw(queryParameters, pathParameters) {
    var _this = this;

    var endpoint = getEndpoint.call(this, pathParameters);

    return BrowserShim.fetch(endpoint + StringUtil.buildQueryParameters(queryParameters)).then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        throw new SdkError(_this, 'API responded with http code ' + response.status + ' for endpoint "' + endpoint + '"');
      }
    }).then(function (json) {
      return _this.parse(json);
    });
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
  parse: function parse(data) {
    return data;
  }
};

function getEndpoint(pathParameters) {
  if (!apiPaths.has(this)) {
    throw new SdkError(this, 'apiPath has not been set. Use #setApiPath(path)');
  }

  var apiPath = apiPaths.get(this);
  apiPath = StringUtil.namedFormat(apiPath, pathParameters, true);

  if (apiPath.endsWith('/')) {
    apiPath = apiPath.slice(0, -1);
  }

  return this.sdk.config.get('endpoint') + apiPath;
}

module.exports = FetchMixin;