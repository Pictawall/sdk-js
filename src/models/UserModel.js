'use strict';

import PictawallModel from './abstract/PictawallModel';

/**
 * User model.
 *
 * @class UserModel
 * @extends PictawallModel
 */
class UserModel extends PictawallModel {

  /**
   * @param {!EventModel} event The event this user is creating content for.
   */
  constructor(event) {
    super(event.sdk);

    this._event = event;
    this.parseResponse = data => data.data;
  }

  /**
   * @inheritDoc
   */
  setProperties(properties) {
    this.apiPath = `/events/${this._event.getProperty('identifier')}/users/${properties.id}`;

    return super.setProperties(properties);
  }

  /**
   * @inheritDoc
   */
  setProperty(name, value) {
    if (name === 'id') {
      this.apiPath = `/events/${this._event.getProperty('identifier')}/users/${value}`;
    }

    super.setProperty(name, value);
  }

  /**
   * Call this method if the owner.avatar url points to a dead link.
   *
   * @returns {!Promise.<this>}
   */
  markAvatarAsDead() {
    return this.sdk.callApi(`${this.apiPath}/check`, { method: 'PATCH' }).then(() => this);
  }

  /**
   * @inheritDoc
   */
  get type() {
    return 'user';
  }
}

export default UserModel;
