'use strict';

var ClassMock = require('../../mock/ClassMock');
var FetchShim = require('../../../src/core/FetchShim');
var XhrMock = require('../../mock/XhrMock');

var EventModel = require('../../../src/models/EventModel');
var ChannelModel = require('../../../src/models/ChannelModel');

describe('SDK', function () {

  var sdk = ClassMock.sdk;

  it('can make events', function (done) {
    sdk.getEvent(XhrMock.VALID_IDENTIFIER).then(function (event) {

      expect(event).toEqual(jasmine.any(EventModel));
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

      expect(channel).toEqual(jasmine.any(ChannelModel));

      var event = channel.event;
      expect(event).toEqual(jasmine.any(EventModel));
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