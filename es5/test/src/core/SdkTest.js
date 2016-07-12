'use strict';

var _EventModel = require('../../../src/models/EventModel');

var _EventModel2 = _interopRequireDefault(_EventModel);

var _ChannelModel = require('../../../src/models/ChannelModel');

var _ChannelModel2 = _interopRequireDefault(_ChannelModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ClassMock = require('../../mock/ClassMock');
var XhrMock = require('../../mock/XhrMock');

describe('SDK', function () {

  var sdk = ClassMock.sdk;

  it('can make events', function (done) {
    sdk.getEvent(XhrMock.EVENT_ID).then(function (event) {

      expect(event).toEqual(jasmine.any(_EventModel2.default));
      expect(event.getProperty('id')).toBe(44759);
      expect(event.getCollection('assets').loaded).toBe(true);
      expect(event.getCollection('users').loaded).toBe(true);
      expect(event.getCollection('ads').loaded).toBe(true);
      expect(event.getCollection('messages').loaded).toBe(true);

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

      done();
    }).catch(function (e) {
      fail(e);
      done();
    });
  });
});