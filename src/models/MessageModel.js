'use strict';

import PictawallModel from './abstract/PictawallModel';

/**
 * Message model.
 *
 * @class MessageModel
 * @extends PictawallModel
 */
class MessageModel extends PictawallModel {

  /**
   * @param {!Sdk} sdk The instance of the SDK.
   */
  constructor(sdk) {
    super(sdk);
  }

  /**
   * @inheritDoc
   */
  get type() {
    return 'message';
  }
}

export default MessageModel;
