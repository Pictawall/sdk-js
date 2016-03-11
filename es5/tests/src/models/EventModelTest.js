'use strict';

var AssertUtil = require('../../util/AssertUtil');
var XhrMock = require('../../mock/XhrMock');

var EventModel = require('../../../src/models/EventModel');
var ClassMock = require('../../mock/ClassMock');

describe('EventModel', function () {

  describe('fetch', function () {

    it('rejects if the identifier is not found', function (done) {
      var fetchPromise = ClassMock.build(EventModel, XhrMock.INVALID_IDENTIFIER).fetch();

      expect(fetchPromise).toEqual(jasmine.any(Promise));

      fetchPromise.then(function () {
        fail('EventModel should return a failed promise if the identifier is invalid.');
      }).catch(function () {
        done();
      });
    });

    it('resolves once everything is loaded', function (done) {
      var eventPromise = ClassMock.build(EventModel, XhrMock.VALID_IDENTIFIER).fetch();

      expect(eventPromise).toEqual(jasmine.any(Promise));

      eventPromise.then(function (event) {
        expect(event).toEqual(jasmine.any(EventModel));

        // Collections have loaded.
        expect(event.assetCollection.loaded).toBe(true);
        expect(event.userCollection.loaded).toBe(true);
        expect(event.adCollection.loaded).toBe(true);
        expect(event.messageCollection.loaded).toBe(true);

        // data is loaded.
        AssertUtil.assertModelLoaded(event, XhrMock.VALID_EVENT.data);

        done();
      }).catch(function (e) {
        fail(e);
        done();
      });
    });
  });
});