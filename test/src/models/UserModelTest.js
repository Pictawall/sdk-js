'use strict';

import UserModel from '../../../src/models/UserModel';
import FetchShim from '../../../src/core/fetch';

const ClassMock = require('../../mock/ClassMock');
const XhrMock = require('../../mock/XhrMock');
const FakeFetch = require('../../mock/Xhr/FakeFetch');

describe('UserModel', () => {

  const userData = XhrMock.USER.data;

  /**
   * @type UserModel
   */
  const userModel = ClassMock.build(UserModel, userData.id, XhrMock.EVENT_ID_FEATURED);

  it('can be retrieved from the server', done => {
    userModel.fetch().then(() => done()).catch(e => {
      fail(e);
      done();
    });
  });

  it('can be marked as dead', () => {
    spyOn(FetchShim, 'fetch').and.returnValue(Promise.resolve(new FakeFetch.FakeResponse('{}', 200)));

    userModel.markAvatarAsDead();

    expect(FetchShim.fetch).toHaveBeenCalledWith(`${ClassMock.sdk.apiBaseUrl}/events/${XhrMock.EVENT_ID_FEATURED}/users/${userData.id}/check`, { method: 'PATCH' });
  });
});

