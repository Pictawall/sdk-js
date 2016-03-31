'use strict';

import Sdk from '../src/app_server';

require('./src/mixins/MongoQuery/MongoFinderTest');
require('./src/mixins/MongoQuery/mongoWhereParserTest');

describe('API', () => {
  const XhrMock = require('./mock/XhrMock');

  beforeAll(done => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 2500;

    require('./mock/ClassMock').sdk.polyfillPromise.then(() => {
      XhrMock.init();
      done();
    }).catch(e => {
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

  afterAll(() => XhrMock.destroy());
});

require('./src/util/ArrayUtilTest');
require('./src/util/ClassUtilTest');
require('./src/util/ObjectUtilTest');
require('./src/util/StringUtilTest');
