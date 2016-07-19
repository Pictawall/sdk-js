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
   * @param {!(String|Error)} message - A message to display.
   * @param {!(Error|String)} previousException - The previous error message.
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

    this.name = this.constructor.name;
    this.previousException = previousException;
  }

  toString() {
    return 'Hey';
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
 */
export class NetworkError extends PictawallError {
  constructor(...args) {
    super(...args);
  }
}

NetworkError.prototype.name = 'NetworkError';
