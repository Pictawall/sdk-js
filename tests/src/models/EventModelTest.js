'use strict';

const EventModel = require('../../../src/models/EventModel');
const XhrMock = require('../../mock/XhrMock');

describe('EventModel', () => {

  let event;

  describe('constructor', () => {
    it('requires an event identifier', () => {
      try {
        new EventModel();
      } catch (e) {
        expect(e.message).toBe('Event identifier is not set');
      }
    });

    it('sends a synchronise-failed event when the identifier is invalid', done => {
      const event = new EventModel({ identifier: XhrMock.INVALID_IDENTIFIER });

      event.once('synchronised', () => {
        fail('Event creation should have failed.');
      });

      event.once('synchronise-failed', () => {
        done();
      });
    });

    it('sends a synchronised event when the identifier is valid', done => {
      event = new EventModel({ identifier: XhrMock.VALID_IDENTIFIER });
      module.exports.event = event;

      event.once('synchronised', () => {
        done();
      });

      event.once('synchronise-failed', e => {
        fail(e);
        done();
      });
    });
  });

  describe('static constructor', () => {
    let eventPromise;

    it('exists', () => {
      expect(EventModel.createAsync).toEqual(jasmine.any(Function));
    });

    it('rejects the promise if the identifier is invalid', done => {
      EventModel
        .createAsync({ identifier: XhrMock.INVALID_IDENTIFIER })
        .then(() => fail('Promise should have been rejected'))
        .catch(() => done());
    });

    it('returns a promise', () => {
      eventPromise = EventModel.createAsync({ identifier: XhrMock.VALID_IDENTIFIER });
      expect(eventPromise).toEqual(jasmine.any(Promise));
    });

    it('resolves the event once everything is loaded', done => {
      eventPromise
        .then(event => {
          expect(event).toEqual(jasmine.any(EventModel));

          // Collections have loaded
          expect(event.assetCollection.currentPage).not.toBeNull();
          // TODO add more collections

          done();
        })
        .catch(e => {
          fail(e);
          done();
        });
    });
  });
});
