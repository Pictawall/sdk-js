'use strict';

import EventModel from '../../../src/models/EventModel';
import ChannelModel from '../../../src/models/ChannelModel';

const ClassMock = require('../../mock/ClassMock');
const XhrMock = require('../../mock/XhrMock');

describe('SDK', () => {

  const sdk = ClassMock.sdk;

  it('can make events', done => {
    sdk.getEvent(XhrMock.EVENT_ID).then(event => {

      expect(event).toEqual(jasmine.any(EventModel));
      expect(event.getProperty('id')).toBe(44759);
      expect(event.getCollection('assets').loaded).toBe(true);
      expect(event.getCollection('users').loaded).toBe(true);
      expect(event.getCollection('ads').loaded).toBe(true);
      expect(event.getCollection('messages').loaded).toBe(true);

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

      done();
    }).catch(e => {
      fail(e);
      done();
    });
  });
});
