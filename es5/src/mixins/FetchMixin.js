'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Symbols = void 0;

var _Errors = require('../core/Errors');

var Symbols = exports.Symbols = {
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
var FetchMixin = {

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

  fetchRaw: function fetchRaw(queryParameters, pathParameters) {
    var response, body;
    return regeneratorRuntime.async(function fetchRaw$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (this.apiPath) {
              _context.next = 2;
              break;
            }

            throw new _Errors.SdkError(this, 'Property "apiPath" is not defined.');

          case 2:
            if (this.sdk) {
              _context.next = 4;
              break;
            }

            throw new _Errors.SdkError(this, 'Property "sdk" is not defined');

          case 4:
            _context.next = 6;
            return regeneratorRuntime.awrap(this.sdk.callApi(this.apiPath, { queryParameters: queryParameters, pathParameters: pathParameters }));

          case 6:
            response = _context.sent;

            if (response.ok) {
              _context.next = 9;
              break;
            }

            throw new _Errors.ApiError(this, 'API responded with http code ' + response.status + ' for endpoint "' + response.url + '"', response);

          case 9:
            _context.next = 11;
            return regeneratorRuntime.awrap(response.json());

          case 11:
            body = _context.sent;

            if (!(typeof this[Symbols.parseResponse] !== 'function')) {
              _context.next = 14;
              break;
            }

            return _context.abrupt('return', body);

          case 14:
            return _context.abrupt('return', this[Symbols.parseResponse](body));

          case 15:
          case 'end':
            return _context.stop();
        }
      }
    }, null, this);
  }
};

exports.default = FetchMixin;