'use strict';

const ClassUtil = require('../util/ClassUtil');

/**
 * Error that prints the name of the class of the thrower.
 *
 * @extends Error
 */
class PictawallError extends Error {

  /**
   * @param {*} thrower The thrower of this error.
   * @param {!String} message A message to display.
   * @param {string} [filename] The filename in which the error occurred.
   * @param {number} [lineNumber] The line at which the error occurred.
   */
  constructor(thrower, message, filename, lineNumber) {
    super(`[${ClassUtil.getName(thrower)}] ${message}`, filename, lineNumber);

    this.name = this.constructor.name;
  }
}

/**
 * Error to use for internal SDK errors.
 *
 * @extends PictawallError
 */
class SdkError extends PictawallError {
  constructor(...args) {
    super(...args);
  }
}

module.exports = { PictawallError, SdkError };
