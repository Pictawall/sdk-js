'use strict';

var _AssetModel = require('../../../src/models/AssetModel');

var _AssetModel2 = _interopRequireDefault(_AssetModel);

var _UserModel = require('../../../src/models/UserModel');

var _UserModel2 = _interopRequireDefault(_UserModel);

var _fetch = require('../../../src/core/fetch');

var _fetch2 = _interopRequireDefault(_fetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ClassMock = require('../../mock/ClassMock');
var XhrMock = require('../../mock/XhrMock');
var FakeFetch = require('../../mock/Xhr/FakeFetch');

describe('AssetModel', function () {

  var assetData = XhrMock.ASSET_FEATURED.data;

  /**
   * @type AssetModel
   */
  var assetModel = ClassMock.build(_AssetModel2.default, assetData.id, XhrMock.EVENT_ID_FEATURED);

  it('can be retrieved from the server', function (done) {
    assetModel.fetch().then(function () {
      return done();
    }).catch(function (e) {
      fail(e);
      done();
    });
  });

  it('has an owner property', function () {
    expect(assetModel.owner).toEqual(jasmine.any(_UserModel2.default), 'Owner is not of type UserModel');
    expect(assetModel.owner.getProperty('id')).toBe(assetData.owner.id, 'Owner ID does not match, the owner need to be fetched');
  });

  it('can be marked as dead', function () {
    spyOn(_fetch2.default, 'fetch').and.returnValue(Promise.resolve(new FakeFetch.FakeResponse('{}', 200)));

    assetModel.markMediaAsDead();

    expect(_fetch2.default.fetch).toHaveBeenCalledWith(ClassMock.sdk.apiBaseUrl + '/events/' + XhrMock.EVENT_ID_FEATURED + '/assets/' + assetData.id + '/check', { method: 'PATCH' });
  });

  it('can be reported', function () {
    spyOn(_fetch2.default, 'fetch').and.returnValue(Promise.resolve(new FakeFetch.FakeResponse('{}', 200)));

    assetModel.report();

    expect(_fetch2.default.fetch).toHaveBeenCalledWith(ClassMock.sdk.apiBaseUrl + '/events/' + XhrMock.EVENT_ID_FEATURED + '/assets/' + assetData.id + '/report', { method: 'PATCH' });
  });
});