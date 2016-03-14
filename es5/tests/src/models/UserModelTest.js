'use strict';

var UserModel = require('../../../src/models/UserModel');

var ClassMock = require('../../mock/ClassMock');
var XhrMock = require('../../mock/XhrMock');
var FetchShim = require('../../../src/core/FetchShim');
var FakeFetch = require('../../mock/Xhr/FakeFetch');

describe('UserModel', function () {

  var userData = XhrMock.VALID_EVENT_USER.data;

  /**
   * @type UserModel
   */
  var userModel = ClassMock.build(UserModel, userData.id, XhrMock.VALID_IDENTIFIER_FEATURED);

  it('can be retrieved from the server', function (done) {
    userModel.fetch().then(function () {
      return done();
    }).catch(function (e) {
      fail(e);
      done();
    });
  });

  it('can be marked as dead', function () {
    spyOn(FetchShim, 'fetch').and.returnValue(Promise.resolve(new FakeFetch.FakeResponse('{}', 200)));

    userModel.markAvatarAsDead();

    expect(FetchShim.fetch).toHaveBeenCalledWith(ClassMock.sdk.apiBaseUrl + '/events/' + XhrMock.VALID_IDENTIFIER_FEATURED + '/users/' + userData.id + '/check', { method: 'PATCH' });
  });
});