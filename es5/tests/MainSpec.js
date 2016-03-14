'use strict';

require('./src/mixins/MongoQuery/MongoFinderTest');
require('./src/mixins/MongoQuery/mongoWhereParserTest');

describe('API', function () {
  var XhrMock = require('./mock/XhrMock');

  beforeAll(function (done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 2500;

    require('./mock/ClassMock').sdk.loadPolyfills().then(function () {
      XhrMock.init();
      done();
    }).catch(function (e) {
      fail(e);
      done();
    });
  });

  require('./src/core/SdkTest');
  require('./src/models/EventModelTest');
  require('./src/models/AssetModelTest');
  require('./src/models/UserModelTest');

  require('./src/collections/BaseCollectionTest');
  require('./src/collections/AssetCollectionTest');

  afterAll(function () {
    return XhrMock.destroy();
  });
});

require('./src/util/ArrayUtilTest');
require('./src/util/ClassUtilTest');
require('./src/util/ObjectUtilTest');
require('./src/util/StringUtilTest');