'use strict';

import PagedCollection from './PagedCollection';
import UserModel from '../models/UserModel';

// TODO updateAll

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
  add(newModel, replace = true, persist = true) {
    const index = this._models.findIndex(model => {
      return model.getProperty('id') === newModel.getProperty('id');
    });

    if (index === -1) {
      this._models.push(newModel);
      return newModel;
    }

    if (replace) {
      this._models[index] = newModel;
      return newModel;
    } else {
      return this._models[index];
    }
  }

  /**
   * @inheritDoc
   */
  createModel() {
    return new UserModel(this._event);
  }
}

export default UserCollection;
