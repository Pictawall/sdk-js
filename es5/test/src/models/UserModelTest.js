'use strict';

var _UserModel = require('../../../src/models/UserModel');

var _UserModel2 = _interopRequireDefault(_UserModel);

var _FetchShim = require('../../../src/core/FetchShim');

var _FetchShim2 = _interopRequireDefault(_FetchShim);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ClassMock = require('../../mock/ClassMock');
var XhrMock = require('../../mock/XhrMock');
var FakeFetch = require('../../mock/Xhr/FakeFetch');

describe('UserModel', function () {

  var userData = XhrMock.VALID_EVENT_USER.data;

  /**
   * @type UserModel
   */
  var userModel = ClassMock.build(_UserModel2.default, userData.id, XhrMock.VALID_IDENTIFIER_FEATURED);

  it('can be retrieved from the server', function (done) {
    userModel.fetch().then(function () {
      return done();
    }).catch(function (e) {
      fail(e);
      done();
    });
  });

  it('can be marked as dead', function () {
    spyOn(_FetchShim2.default, 'fetch').and.returnValue(Promise.resolve(new FakeFetch.FakeResponse('{}', 200)));

    userModel.markAvatarAsDead();

    expect(_FetchShim2.default.fetch).toHaveBeenCalledWith(ClassMock.sdk.apiBaseUrl + '/events/' + XhrMock.VALID_IDENTIFIER_FEATURED + '/users/' + userData.id + '/check', { method: 'PATCH' });
  });
});