'use strict';

const BaseModel = require('./BaseModel');

class UserModel extends BaseModel {

  constructor(sdk) {
    super(sdk);
  }

  /**
   * Call this method if the owner.avatar url points to a dead link.
   *
   * @memberOf UserModel
   * @instance
   */
  markAvatarAsDead() {
    // TODO NYI
    // PATCH user/id/check
  }
}

module.exports = UserModel;
