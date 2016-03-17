'use strict';

import BaseModel from './BaseModel';

/**
 * Message model.
 *
 * @class MessageModel
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

export default MessageModel;
