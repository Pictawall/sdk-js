'use strict';

var _EventModel = require('../../../src/models/EventModel');

var _EventModel2 = _interopRequireDefault(_EventModel);

var _ChannelModel = require('../../../src/models/ChannelModel');

var _ChannelModel2 = _interopRequireDefault(_ChannelModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ClassMock = require('../../mock/ClassMock');
var FetchShim = require('../../../src/core/FetchShim');
var XhrMock = require('../../mock/XhrMock');

describe('SDK', function () {

  var sdk = ClassMock.sdk;

  it('can make events', function (done) {
    sdk.getEvent(XhrMock.VALID_IDENTIFIER).then(function (event) {

      expect(event).toEqual(jasmine.any(_EventModel2.default));
      expect(event.getProperty('id')).toBe(44759);
      expect(event.assetCollection.loaded).toBe(true);
      expect(event.messageCollection.loaded).toBe(true);
      expect(event.userCollection.loaded).toBe(true);
      expect(event.adCollection.loaded).toBe(true);

      done();
    }).catch(function (e) {
      fail(e);
      done();
    });
  });

  it('can make channels', function (done) {
    sdk.getChannel(XhrMock.CHANNEL_ID).then(function (channel) {

      expect(channel).toEqual(jasmine.any(_ChannelModel2.default));

      var event = channel.event;
      expect(event).toEqual(jasmine.any(_EventModel2.default));
      expect(event.getProperty('id')).toBe(44759);
      expect(event.assetCollection.loaded).toBe(true);
      expect(event.messageCollection.loaded).toBe(true);
      expect(event.userCollection.loaded).toBe(true);
      expect(event.adCollection.loaded).toBe(true);

      done();
    }).catch(function (e) {
      fail(e);
      done();
    });
  });
});