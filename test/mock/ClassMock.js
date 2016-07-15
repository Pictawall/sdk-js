'use strict';

import Sdk from '../../src/core/Sdk';
import EventModel from '../../src/models/EventModel';
import AssetModel from '../../src/models/AssetModel';
import UserModel from '../../src/models/UserModel';
import AssetCollection from '../../src/collections/AssetCollection';

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
      return new EventModel(ClassMock.sdk, identifier || require('./XhrMock').EVENT_ID);
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
