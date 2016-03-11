'use strict';

const EventModel = require('../../../src/models/EventModel');
const XhrMock = require('../../mock/XhrMock');
const AssertUtil = require('../../util/AssertUtil');

//describe('ChannelModel', () => {

//  describe('constructor', () => {
//    it('rejects if the identifier is invalid', done => {
//      const eventPromise = new EventModel();
//
//      expect(eventPromise).toEqual(jasmine.any(Promise));
//
//      eventPromise.then(() => {
//        fail('EventModel should return a failed promise if the identifier is invalid.');
//        done();
//      }).catch(e => {
//        expect(e.message).toBe('[EventModel] Event identifier "undefined" is not valid.');
//        done();
//      });
//    });
//
//    it('rejects if the identifier is not found', done => {
//      const eventPromise = new EventModel({ identifier: XhrMock.INVALID_IDENTIFIER });
//
//      expect(eventPromise).toEqual(jasmine.any(Promise));
//
//      eventPromise.then(() => {
//        fail('EventModel should return a failed promise if the identifier is invalid.');
//      }).catch(() => {
//        done();
//      });
//    });
//
//    it('resolves once everything is loaded', done => {
//      const eventPromise = new EventModel({ identifier: XhrMock.VALID_IDENTIFIER });
//
//      expect(eventPromise).toEqual(jasmine.any(Promise));
//
//      eventPromise.then(event => {
//        expect(event).toEqual(jasmine.any(EventModel));
//
//        // Collections have loaded.
//        expect(event.assetCollection.loaded).toBe(true);
//
//        // TODO add more collections
//
//        // data is loaded.
//        AssertUtil.assertModelLoaded(event, XhrMock.VALID_EVENT.data);
//
//        module.exports.event = event;
//
//        done();
//      }).catch(e => {
//        fail(e);
//        done();
//      });
//    });
//  });
//});

