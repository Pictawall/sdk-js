'use strict';

import { SdkError, ApiError } from '../core/Errors';

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
  async fetchRaw(queryParameters, pathParameters) {
    if (!this.apiPath) {
      throw new SdkError(this, 'Property "apiPath" is not defined.');
    }

    if (!this.sdk) {
      throw new SdkError(this, 'Property "sdk" is not defined');
    }

    const response = await this.sdk.callApi(this.apiPath, { queryParameters, pathParameters });

    if (!response.ok) {
      throw new ApiError(this, `API responded with http code ${response.status} for endpoint "${response.url}"`, response);
    }

    const body = await response.json();

    if (typeof this[Symbols.parseResponse] !== 'function') {
      return body;
    }

    return this[Symbols.parseResponse](body);
  }
};

export default FetchMixin;
