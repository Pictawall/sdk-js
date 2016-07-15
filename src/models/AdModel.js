import PictawallModel from './abstract/PictawallModel';
'use strict';

/**
 * Advertisement model.
 *
 * @class AdModel
 * @extends PictawallModel
 */
class AdModel extends PictawallModel {

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
    return 'ad';
  }
}

export default AdModel;
