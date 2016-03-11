'use strict';

var _fetchParser, _FetchMixin, _mutatorMap;

function _defineEnumerableProperties(obj, descs) { for (var key in descs) { var desc = descs[key]; desc.configurable = desc.enumerable = true; if ("value" in desc) desc.writable = true; Object.defineProperty(obj, key, desc); } return obj; }

var SdkError = require('../core/Errors').SdkError;

var _fetchParsers = new WeakMap();

/**
 * Defines a fetch function that can be used in collections and models.
 *
 * @mixin FetchMixin
 */
var FetchMixin = (_FetchMixin = {

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
      throw new SdkError(this, 'Property apiPath has not been set.');
    }

    var promise = this.sdk.callApi(this.apiPath, { queryParameters: queryParameters, pathParameters: pathParameters }).then(function (response) {
      if (!response.ok) {
        throw new SdkError(_this, 'API responded with http code ' + response.status + ' for endpoint "' + response.url + '"');
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
  }

}, _fetchParser = 'fetchParser', _mutatorMap = {}, _mutatorMap[_fetchParser] = _mutatorMap[_fetchParser] || {}, _mutatorMap[_fetchParser].get = function () {
  return _fetchParsers.get(this);
}, _defineEnumerableProperties(_FetchMixin, _mutatorMap), _FetchMixin);

module.exports = FetchMixin;