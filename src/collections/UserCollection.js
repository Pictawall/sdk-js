'use strict';

const PagedCollection = require('./PagedCollection');
const UserModel = require('../models/UserModel');

// TODO updateAll
// TODO handle scores

/**
 * Collection of event users.
 *
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

module.exports = UserCollection;
