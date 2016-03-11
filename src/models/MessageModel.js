'use strict';

const BaseModel = require('./BaseModel');

/**
 * Message model.
 *
 * @extends BaseModel
 */
class MessageModel extends BaseModel {

  /**
   * @param {!Sdk} sdk The instance of the SDK.
   */
  constructor(sdk) {
    super(sdk);
  }
}

module.exports = MessageModel;
