'use strict';

import AssetModel from '../../../src/models/AssetModel';
import UserModel from '../../../src/models/UserModel';
import FetchShim from '../../../src/core/FetchShim';

const ClassMock = require('../../mock/ClassMock');
const XhrMock = require('../../mock/XhrMock');
const FakeFetch = require('../../mock/Xhr/FakeFetch');

describe('AssetModel', () => {

  const assetData = XhrMock.VALID_EVENT_ASSET_FEATURED.data;

  /**
   * @type AssetModel
   */
  const assetModel = ClassMock.build(AssetModel, assetData.id, XhrMock.VALID_IDENTIFIER_FEATURED);

  it('can be retrieved from the server', done => {
    assetModel.fetch().then(() => done()).catch(e => {
      fail(e);
      done();
    });
  });

  it('has an owner property', () => {
    expect(assetModel.owner).toEqual(jasmine.any(UserModel), 'Owner is not of type UserModel');
    expect(assetModel.owner.getProperty('id')).toBe(assetData.owner.id, 'Owner ID does not match, the owner need to be fetched');
  });

  it('can be marked as dead', () => {
    spyOn(FetchShim, 'fetch').and.returnValue(Promise.resolve(new FakeFetch.FakeResponse('{}', 200)));

    assetModel.markMediaAsDead();

    expect(FetchShim.fetch).toHaveBeenCalledWith(`${ClassMock.sdk.apiBaseUrl}/events/${XhrMock.VALID_IDENTIFIER_FEATURED}/assets/${assetData.id}/check`, { method: 'PATCH' });
  });

  it('can be reported', () => {
    spyOn(FetchShim, 'fetch').and.returnValue(Promise.resolve(new FakeFetch.FakeResponse('{}', 200)));

    assetModel.report();

    expect(FetchShim.fetch).toHaveBeenCalledWith(`${ClassMock.sdk.apiBaseUrl}/events/${XhrMock.VALID_IDENTIFIER_FEATURED}/assets/${assetData.id}/report`, { method: 'PATCH' });
  });
});

