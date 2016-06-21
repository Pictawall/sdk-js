'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Errors = require('../core/Errors');

var _fetchParsers = new WeakMap();

/**
 * Defines a fetch function that can be used in collections and models.
 *
 * @mixin FetchMixin
 */
var FetchMixin = {

  /**
   * <p>Executes an HTTP GET on the api path of the model and returns the HTTP response as JSON.</p>
   * <p>If a fetch parser has been set using {@link FetchMixin#setFetchParser}, the json will be passed to the parser before the promise resolves.</p>
   *
   * @param {Object.<String, *>} [queryParameters = {}] A list of query parameters to add to the request, keys of the object will
   *                                 be used as the names of the parameters and values of the object as the values
   *                                 of the parameters.
   * @param {Object.<String, String>} [pathParameters = {}] A list of path parameters to inject in the API path.
   * @returns {Promise.<*>}
   *
   * @example
   * // With path parameters.
   * model.setApiPath('/event/{eventId}');
   * model.fetchRaw({ limit: 100 }, { eventId: 45 }).then(json => console.log(json));
   *
   * @example
   * // Without path parameters.
   * model.setApiPath('/event/45');
   * model.fetchRaw({ limit: 100 }).then(json => console.log(json));
   *
   * @instance
   */

  fetchRaw: function fetchRaw(queryParameters, pathParameters) {
    var _this = this;

    if (!this.apiPath) {
      throw new _Errors.SdkError(this, 'Property apiPath has not been set.');
    }

    var promise = this.sdk.callApi(this.apiPath, { queryParameters: queryParameters, pathParameters: pathParameters }).then(function (response) {
      if (!response.ok) {
        throw new _Errors.SdkError(_this, 'API responded with http code ' + response.status + ' for endpoint "' + response.url + '"');
      }

      return response.json();
    });

    var parser = this.fetchParser;
    if (!parser) {
      return promise;
    }

    return promise.then(function (json) {
      return parser(json);
    });
  },


  /**
   * Parses the data retrieved by {@link FetchMixin#fetchRaw}.
   *
   * @callback FetchParser
   * @param {!*} serverResponse The data fetched from the server, as an object.
   * @return {!*} The parsed data, to use to populate the model / collection.
   */

  /**
   * Set this object if the data returned by the server is not directly usable to populate a model or collection and needs to be modified.
   * @type {FetchParser}
   *
   * @instance
   * @example
   * // The server returns something like
   * // {
   * //   "type": "user",
   * //   "data": {
   * //     "id": 45,
   * //     "name": "john"
   * //   }
   * // }
   * this.fetchParser = (serverResponse => {
   *  // return the actual data to put in the model's properties.
   *  return serverResponse.data;
   * });
   */
  set fetchParser(parser) {
    _fetchParsers.set(this, parser);
  },

  get fetchParser() {
    return _fetchParsers.get(this);
  }
};

exports.default = FetchMixin;