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
   * @param {*} thrower - The thrower of this error.
   * @param {!String} message - A message to display.
   * @param [errorArgs] errorArgs - The list of args to pass to the Error constructor after the message parameter.
   */
  constructor(thrower, message, ...errorArgs) {
    super(`[${ClassUtil.getName(thrower)}] ${message}`, ...errorArgs);

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
