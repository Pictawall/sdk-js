'use strict';

var Sdk = require('../../src/core/Sdk');
var _EventModel = require('../../src/models/EventModel');
var _AssetModel = require('../../src/models/AssetModel');
var _UserModel = require('../../src/models/UserModel');
var _AssetCollection = require('../../src/collections/AssetCollection');

var ClassMock = {
  /**
   * @type Sdk
   */
  sdk: new Sdk(),

  build: function build(classToMock) {
    var _mockers;

    if (this._mockers[classToMock.name] === void 0) {
      throw new Error('Unknown class ' + classToMock.name + '.');
    }

    for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      params[_key - 1] = arguments[_key];
    }

    return (_mockers = this._mockers)[classToMock.name].apply(_mockers, params);
  },


  _mockers: {
    EventModel: function EventModel(identifier) {
      return new _EventModel(ClassMock.sdk, identifier || require('./XhrMock').VALID_IDENTIFIER);
    },

    AssetModel: function AssetModel(assetId, eventId) {
      var model = new _AssetModel(ClassMock.build(_EventModel, eventId));
      model.setProperty('id', assetId);

      return model;
    },

    UserModel: function UserModel(userId, eventId) {
      var model = new _UserModel(ClassMock.build(_EventModel, eventId));
      model.setProperty('id', userId);

      return model;
    },

    AssetCollection: function AssetCollection(eventId, config) {
      return new _AssetCollection(ClassMock.build(_EventModel, eventId), config);
    }
  }
};

module.exports = ClassMock;