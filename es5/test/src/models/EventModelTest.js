'use strict';

var _EventModel = require('../../../src/models/EventModel');

var _EventModel2 = _interopRequireDefault(_EventModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AssertUtil = require('../../util/AssertUtil');
var XhrMock = require('../../mock/XhrMock');
var ClassMock = require('../../mock/ClassMock');

describe('EventModel', function () {

  describe('fetch', function () {

    it('rejects if the identifier is not found', function (done) {
      var fetchPromise = ClassMock.build(_EventModel2.default, XhrMock.INVALID_IDENTIFIER).fetch();

      expect(fetchPromise).toEqual(jasmine.any(Promise));

      fetchPromise.then(function () {
        fail('EventModel should return a failed promise if the identifier is invalid.');
      }).catch(function () {
        done();
      });
    });

    it('resolves once everything is loaded', function (done) {
      var eventPromise = ClassMock.build(_EventModel2.default, XhrMock.VALID_IDENTIFIER).fetch();

      expect(eventPromise).toEqual(jasmine.any(Promise));

      eventPromise.then(function (event) {
        expect(event).toEqual(jasmine.any(_EventModel2.default));

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