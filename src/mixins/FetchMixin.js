'use strict';

import { SdkError } from '../core/Errors';

export const Symbols = {
  /**
   * Use this to define a function to call with the server response from fetchRaw.
   */
  parseResponse: Symbol('parseResponse')
};

/**
 * Defines a fetch function that can be used in collections and models.
 *
 * @mixin FetchMixin
 */
const FetchMixin = {

  /**
   * <p>Executes an HTTP GET on the api path of the model and returns the HTTP response as JSON.</p>
   * <p>If a fetch parseResponse has been set using {@link FetchMixin#setFetchParser}, the json will be passed to the parseResponse before the promise resolves.</p>
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
  fetchRaw(queryParameters, pathParameters) {
    if (!this.apiPath) {
      throw new SdkError(this, 'Property apiPath has not been set.');
    }

    const promise = this.sdk.callApi(this.apiPath, { queryParameters, pathParameters })
      .then(response => {
        if (!response.ok) {
          throw new SdkError(this, `API responded with http code ${response.status} for endpoint "${response.url}"`);
        }

        return response.json();
      });

    if (typeof this[Symbols.parseResponse] !== 'function') {
      return promise;
    }

    return promise.then(json => this[Symbols.parseResponse](json));
  }
};

export default FetchMixin;
