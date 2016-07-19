'use strict';

import ClassUtil from '../util/ClassUtil';

/**
 * Error that prints the name of the class of the thrower.
 *
 * @class PictawallError
 * @extends Error
 *
 * @property {Error} previousException - The exception that caused this one.
 * @property {*} thrower - The instance which throwed the exception.
 */
export class PictawallError extends Error {

  /**
   * @param {*} thrower - The thrower of this error.
   * @param {!(String|Error)} message - A message to display.
   * @param {!(Error|String)} [previousException] - The previous error message.
   */
  constructor(thrower, message, previousException) {
    if (typeof message === 'object' || typeof previousException === 'string') {
      const tmp = previousException;
      previousException = message;
      message = tmp;
    }

    if (!message) {
      message = '<No Message Specified>';
    }

    super(`[${ClassUtil.getName(thrower)}] ${message}`);

    ClassUtil.defineFinal(this, 'thrower', thrower);
    ClassUtil.defineFinal(this, 'previousException', previousException);
  }
}

PictawallError.prototype.name = 'PictawallError';

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

SdkError.prototype.name = 'SdkError';

/**
 * Error to use for connectivity problems.
 *
 * @class NetworkError
 * @extends PictawallError
 */
export class NetworkError extends PictawallError {
  constructor(...args) {
    super(...args);
  }
}

NetworkError.prototype.name = 'NetworkError';

/**
 * Error to use for connectivity problems.
 *
 * @class ApiError
 * @extends NetworkError
 * @property {!Response} response - The fetch response.
 */
export class ApiError extends NetworkError {

  /**
   * @param {*} thrower
   * @param {!(String|Error)} message
   * @param {!Response} response
   * @param {!(String|Error)} [previousException]
   */
  constructor(thrower, message, response, previousException) {
    super(thrower, message, previousException);

    ClassUtil.defineFinal(this, 'response', response);
  }
}

ApiError.prototype.name = 'ApiError';
