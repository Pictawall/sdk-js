'use strict';

/**
 * @typedef {Object} AmpersandSync
 * @property {!function} sync
 * @property {!function} fetch
 */

/**
 * @author Guylian Cox <guyliancox@gmail.com>
 *
 * @param {AmpersandSync} originalImplementation.
 * @returns {AmpersandSync} a promisified AmpersandSync.
 */
module.exports = function (originalImplementation) {

  function promisify(methodName, optionIndex) {
    if (originalImplementation[methodName] === void 0) {
      return void 0;
    }

    return function (...args) {

      if (typeof args[optionIndex] !== 'object') {
        args[optionIndex] = {};
      }

      const options = args[optionIndex];

      return new Promise((resolve, reject) => {
        const originalSuccess = options.success;
        const originalError = options.error;

        options.success = function (...data) {
          if (originalSuccess) {
            originalSuccess(...data);
          }

          resolve(...data);
        };

        options.error = function (...data) {
          if (originalError) {
            originalError(...data);
          }

          reject(...data);
        };

        return originalImplementation[methodName].apply(this, args);
      });
    };
  }

  return {
    // collection & model
    sync: promisify('sync', 2),
    save: promisify('save', 2),
    fetch: promisify('fetch', 0),
    destroy: promisify('destroy', 0),

    // collection
    create: promisify('create', 1),
    getOrFetch: promisify('getOrFetch', 1),
    fetchById: promisify('fetchById', 2)
  };
};

