'use strict';

const BaseModel = require('./BaseModel');

/**
 * Advertisement model.
 */
class AdModel extends BaseModel {

  /**
   * @param {!Sdk} sdk The instance of the SDK.
   */
  constructor(sdk) {
    super(sdk);
  }
}

module.exports = AdModel;
