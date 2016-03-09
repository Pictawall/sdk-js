'use strict';

const AssertUtil = require('../../util/AssertUtil');
const XhrMock = require('../../mock/XhrMock');

const EventModel = require('../../../src/models/EventModel');
const singletons = require('../singletons');

describe('EventModel', () => {

  describe('fetch', () => {
    it('rejects if the identifier is not found', done => {
      const fetchPromise = (new EventModel(singletons.sdk, XhrMock.INVALID_IDENTIFIER)).fetch();

      expect(fetchPromise).toEqual(jasmine.any(Promise));

      fetchPromise.then(() => {
        fail('EventModel should return a failed promise if the identifier is invalid.');
      }).catch(() => {
        done();
      });
    });

    it('resolves once everything is loaded', done => {
      const eventPromise = (new EventModel(singletons.sdk, XhrMock.VALID_IDENTIFIER)).fetch();

      expect(eventPromise).toEqual(jasmine.any(Promise));

      eventPromise.then(event => {
        expect(event).toEqual(jasmine.any(EventModel));

        // Collections have loaded.
        expect(event.assetCollection.loaded).toBe(true);
        expect(event.userCollection.loaded).toBe(true);
        expect(event.adCollection.loaded).toBe(true);
        expect(event.messageCollection.loaded).toBe(true);

        // data is loaded.
        AssertUtil.assertModelLoaded(event, XhrMock.VALID_EVENT.data);

        singletons.event = event;

        done();
      }).catch(e => {
        fail(e);
        done();
      });
    });
  });
});

