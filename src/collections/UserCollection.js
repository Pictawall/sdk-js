'use strict';

import PagedCollection from './PagedCollection';
import UserModel from '../models/UserModel';

/**
 * Collection of event users.
 *
 * @class UserCollection
 * @extends PagedCollection
 */
class UserCollection extends PagedCollection {

  /**
   * @param {!EventModel} event The owning event.
   */
  constructor(event) {
    super(event.sdk, 5, 'score');

    this._event = event;
    this.apiPath = `/events/${event.getProperty('identifier')}/users/{userId}`;
    this.fetchParser = data => data.data;
  }

  /**
   * @inheritDoc
   */
  createModel() {
    return new UserModel(this._event);
  }
}

export default UserCollection;
