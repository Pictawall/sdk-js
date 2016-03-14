'use strict';

var _Sdk = require('../../src/core/Sdk');

var _Sdk2 = _interopRequireDefault(_Sdk);

var _EventModel2 = require('../../src/models/EventModel');

var _EventModel3 = _interopRequireDefault(_EventModel2);

var _AssetModel2 = require('../../src/models/AssetModel');

var _AssetModel3 = _interopRequireDefault(_AssetModel2);

var _UserModel2 = require('../../src/models/UserModel');

var _UserModel3 = _interopRequireDefault(_UserModel2);

var _AssetCollection2 = require('../../src/collections/AssetCollection');

var _AssetCollection3 = _interopRequireDefault(_AssetCollection2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ClassMock = {
  /**
   * @type Sdk
   */
  sdk: new _Sdk2.default(),

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
      return new _EventModel3.default(ClassMock.sdk, identifier || require('./XhrMock').VALID_IDENTIFIER);
    },

    AssetModel: function AssetModel(assetId, eventId) {
      var model = new _AssetModel3.default(ClassMock.build(_EventModel3.default, eventId));
      model.setProperty('id', assetId);

      return model;
    },

    UserModel: function UserModel(userId, eventId) {
      var model = new _UserModel3.default(ClassMock.build(_EventModel3.default, eventId));
      model.setProperty('id', userId);

      return model;
    },

    AssetCollection: function AssetCollection(eventId, config) {
      return new _AssetCollection3.default(ClassMock.build(_EventModel3.default, eventId), config);
    }
  }
};

module.exports = ClassMock;