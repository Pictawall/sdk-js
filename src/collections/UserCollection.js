'use strict';

const PagedCollection = require('./PagedCollection');
const UserModel = require('../models/UserModel');

// TODO updateAll
// TODO handle scores

class UserCollection extends PagedCollection {

  /**
   * @param {!ChannelModel} event The owning event.
   */
  constructor(event) {
    super(event.sdk, 5, 'score');

    this.setApiPath(`/events/${event.getProperty('identifier')}/users/{userId}`);
  }

  /**
   * Parses the response from the server and returns the data to use for model creation.
   *
   * @override
   */
  parse(data) {
    data = super.parse(data);

    this._scores = data.data.scores;

    return data.data.users;
  }

  /**
   * Adds a model to the collection.
   *
   * @param newModel The model to insert.
   * @param {boolean} [replace = true] If a model with the same ID already exists, overwrite it if true. Ignore the new model if false.
   * @param {boolean} [persist = true] Currently unused - Persist the model on the server.
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
   * Model method factory.
   */
  createModel() {
    return new UserModel(this.sdk);
  }
}

module.exports = UserCollection;
