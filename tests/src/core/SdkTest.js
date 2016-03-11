'use strict';

const ClassMock = require('../../mock/ClassMock');
const FetchShim = require('../../../src/core/FetchShim');
const XhrMock = require('../../mock/XhrMock');

const EventModel = require('../../../src/models/EventModel');
const ChannelModel = require('../../../src/models/ChannelModel');

describe('SDK', () => {

  const sdk = ClassMock.sdk;

  it('can make events', done => {
    sdk.getEvent(XhrMock.VALID_IDENTIFIER).then(event => {

      expect(event).toEqual(jasmine.any(EventModel));
      expect(event.getProperty('id')).toBe(44759);
      expect(event.assetCollection.loaded).toBe(true);
      expect(event.messageCollection.loaded).toBe(true);
      expect(event.userCollection.loaded).toBe(true);
      expect(event.adCollection.loaded).toBe(true);

      done();
    }).catch(e => {
      fail(e);
      done();
    });
  });

  it('can make channels', done => {
    sdk.getChannel(XhrMock.CHANNEL_ID).then(channel => {

      expect(channel).toEqual(jasmine.any(ChannelModel));

      const event = channel.event;
      expect(event).toEqual(jasmine.any(EventModel));
      expect(event.getProperty('id')).toBe(44759);
      expect(event.assetCollection.loaded).toBe(true);
      expect(event.messageCollection.loaded).toBe(true);
      expect(event.userCollection.loaded).toBe(true);
      expect(event.adCollection.loaded).toBe(true);

      done();
    }).catch(e => {
      fail(e);
      done();
    });
  });
});
