'use strict';

import EventModel from '../../../src/models/EventModel';

const AssertUtil = require('../../util/AssertUtil');
const XhrMock = require('../../mock/XhrMock');
const ClassMock = require('../../mock/ClassMock');

describe('EventModel', () => {

  describe('fetch', () => {

    it('rejects if the identifier is not found', done => {
      const fetchPromise = (ClassMock.build(EventModel, XhrMock.EVENT_ID_INVALID)).fetch();

      expect(fetchPromise).toEqual(jasmine.any(Promise));

      fetchPromise.then(() => {
        fail('EventModel should return a failed promise if the identifier is invalid.');
      }).catch(() => {
        done();
      });
    });

    it('resolves once everything is loaded', done => {
      const eventPromise = (ClassMock.build(EventModel, XhrMock.EVENT_ID)).fetch();

      expect(eventPromise).toEqual(jasmine.any(Promise));

      eventPromise.then(event => {
        expect(event).toEqual(jasmine.any(EventModel));

        // data is loaded.
        AssertUtil.assertModelLoaded(event, XhrMock.EVENT.data);

        done();
      }).catch(e => {
        fail(e);
        done();
      });
    });
  });
});

