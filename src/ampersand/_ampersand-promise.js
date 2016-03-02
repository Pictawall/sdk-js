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

    return function (...args) {

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
    sync: promisify('sync', 2),
    fetch: promisify('fetch', 0)
  };
};

