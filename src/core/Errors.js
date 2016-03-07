'use strict';

const ClassUtil = require('../util/ClassUtil');

class PictawallError extends Error {

  constructor(thrower, message, filename, lineNumber) {
    super(`[${ClassUtil.getName(thrower)}] ${message}`, filename, lineNumber);

    this.name = this.constructor.name;
  }
}

class SdkError extends PictawallError {
  constructor(...args) {
    super(...args);
  }
}

module.exports = { PictawallError, SdkError };
