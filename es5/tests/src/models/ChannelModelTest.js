'use strict';

var EventModel = require('../../../src/models/EventModel');
var XhrMock = require('../../mock/XhrMock');
var AssertUtil = require('../../util/AssertUtil');

describe('ChannelModel', function () {

  describe('constructor', function () {
    it('rejects if the identifier is invalid', function (done) {
      var eventPromise = new EventModel();

      expect(eventPromise).toEqual(jasmine.any(Promise));

      eventPromise.then(function () {
        fail('EventModel should return a failed promise if the identifier is invalid.');
        done();
      }).catch(function (e) {
        expect(e.message).toBe('[EventModel] Event identifier "undefined" is not valid.');
        done();
      });
    });

    it('rejects if the identifier is not found', function (done) {
      var eventPromise = new EventModel({ identifier: XhrMock.INVALID_IDENTIFIER });

      expect(eventPromise).toEqual(jasmine.any(Promise));

      eventPromise.then(function () {
        fail('EventModel should return a failed promise if the identifier is invalid.');
      }).catch(function () {
        done();
      });
    });

    it('resolves once everything is loaded', function (done) {
      var eventPromise = new EventModel({ identifier: XhrMock.VALID_IDENTIFIER });

      expect(eventPromise).toEqual(jasmine.any(Promise));

      eventPromise.then(function (event) {
        expect(event).toEqual(jasmine.any(EventModel));

        // Collections have loaded.
        expect(event.assetCollection.loaded).toBe(true);

        // TODO add more collections

        // data is loaded.
        AssertUtil.assertModelLoaded(event, XhrMock.VALID_EVENT.data);

        module.exports.event = event;

        done();
      }).catch(function (e) {
        fail(e);
        done();
      });
    });
  });
});