'use strict';

var AssetModel = require('../../../src/models/AssetModel');
var UserModel = require('../../../src/models/UserModel');

var ClassMock = require('../../mock/ClassMock');
var XhrMock = require('../../mock/XhrMock');
var FetchShim = require('../../../src/core/FetchShim');
var FakeFetch = require('../../mock/Xhr/FakeFetch');

describe('AssetModel', function () {

  var assetData = XhrMock.VALID_EVENT_ASSET_FEATURED.data;

  /**
   * @type AssetModel
   */
  var assetModel = ClassMock.build(AssetModel, assetData.id, XhrMock.VALID_IDENTIFIER_FEATURED);

  it('can be retrieved from the server', function (done) {
    assetModel.fetch().then(function () {
      return done();
    }).catch(function (e) {
      fail(e);
      done();
    });
  });

  it('has an owner property', function () {
    expect(assetModel.owner).toEqual(jasmine.any(UserModel), 'Owner is not of type UserModel');
    expect(assetModel.owner.getProperty('id')).toBe(assetData.owner.id, 'Owner ID does not match, the owner need to be fetched');
  });

  it('can be marked as dead', function () {
    spyOn(FetchShim, 'fetch').and.returnValue(Promise.resolve(new FakeFetch.FakeResponse('{}', 200)));

    assetModel.markMediaAsDead();

    expect(FetchShim.fetch).toHaveBeenCalledWith(ClassMock.sdk.apiBaseUrl + '/events/' + XhrMock.VALID_IDENTIFIER_FEATURED + '/assets/' + assetData.id + '/check', { method: 'PATCH' });
  });

  it('can be reported', function () {
    spyOn(FetchShim, 'fetch').and.returnValue(Promise.resolve(new FakeFetch.FakeResponse('{}', 200)));

    assetModel.report();

    expect(FetchShim.fetch).toHaveBeenCalledWith(ClassMock.sdk.apiBaseUrl + '/events/' + XhrMock.VALID_IDENTIFIER_FEATURED + '/assets/' + assetData.id + '/report', { method: 'PATCH' });
  });
});