'use strict';

require('./src/mixins/MongoQuery/MongoCursorTest');

describe('API', () => {
  const XhrMock = require('./mock/XhrMock');

  beforeAll(done => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 2500;

    require('./mock/ClassMock').sdk.loadPolyfills().then(() => {
      XhrMock.init();
      done();
    }).catch(e => {
      fail(e);
      done();
    });
  });

  require('./src/core/SdkTest');
  require('./src/models/EventModelTest');
  require('./src/models/ChannelModelTest');
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
