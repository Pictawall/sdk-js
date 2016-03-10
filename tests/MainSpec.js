'use strict';

require('./src/core/SdkTest');
require('./src/core/ConfigTest');
require('./src/mixins/MongoQuery/MongoCursorTest');

describe('API', () => {
  const XhrMock = require('./mock/XhrMock');
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 2500;

  beforeAll(() => XhrMock.init());

  require('./src/models/EventModelTest');
  require('./src/collections/AssetCollectionTest');

  afterAll(() => XhrMock.destroy());
});

require('./src/util/ArrayUtilTest');
require('./src/util/ClassUtilTest');
require('./src/util/ObjectUtilTest');
require('./src/util/StringUtilTest');
