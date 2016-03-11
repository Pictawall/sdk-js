'use strict';

const Sdk = require('../../src/core/Sdk');
const EventModel = require('../../src/models/EventModel');
const AssetModel = require('../../src/models/AssetModel');
const UserModel = require('../../src/models/UserModel');
const AssetCollection = require('../../src/collections/AssetCollection');

const ClassMock = {
  /**
   * @type Sdk
   */
  sdk: new Sdk(),

  build(classToMock, ...params) {
    if (this._mockers[classToMock.name] === void 0) {
      throw new Error(`Unknown class ${classToMock.name}.`);
    }

    return this._mockers[classToMock.name](...params);
  },

  _mockers: {
    EventModel: (identifier) => {
      return new EventModel(ClassMock.sdk, identifier || require('./XhrMock').VALID_IDENTIFIER);
    },

    AssetModel: (assetId, eventId) => {
      const model = new AssetModel(ClassMock.build(EventModel, eventId));
      model.setProperty('id', assetId);

      return model;
    },

    UserModel: (userId, eventId) => {
      const model = new UserModel(ClassMock.build(EventModel, eventId));
      model.setProperty('id', userId);

      return model;
    },

    AssetCollection: (eventId, config) => {
      return new AssetCollection(ClassMock.build(EventModel, eventId), config);
    }
  }
};

module.exports = ClassMock;
