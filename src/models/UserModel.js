'use strict';

const BaseModel = require('./BaseModel');
const EventModel = require('./EventModel');

class UserModel extends BaseModel {

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
