'use strict';

const BaseModel = require('./BaseModel');

/**
 * User model.
 */
class UserModel extends BaseModel {

  /**
   * @param {!Sdk} sdk The instance of the SDK.
   */
  constructor(sdk) {
    super(sdk);
  }

  /**
   * Call this method if the owner.avatar url points to a dead link.
   */
  markAvatarAsDead() {
    // TODO NYI
    // PATCH user/id/check
  }
}

module.exports = UserModel;
