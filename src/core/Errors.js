'use strict';

import ClassUtil from '../util/ClassUtil';

/**
 * Error that prints the name of the class of the thrower.
 *
 * @class PictawallError
 * @extends Error
 */
export class PictawallError extends Error {

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
 * @class SdkError
 * @extends PictawallError
 */
export class SdkError extends PictawallError {
  constructor(...args) {
    super(...args);
  }
}
