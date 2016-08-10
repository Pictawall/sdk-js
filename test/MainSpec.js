'use strict';

import polyfills from '../src/core/polyfills';

require('./src/mixins/MongoQuery/MongoFinderTest');
require('./src/mixins/MongoQuery/mongoWhereParserTest');

polyfills().then(() => {
  require('./mock/XhrMock').init();

  describe('API', () => {
    beforeAll(() => jasmine.DEFAULT_TIMEOUT_INTERVAL = 2500);

    require('./src/core/SdkTest');
    require('./src/models/EventModelTest');
    require('./src/models/AssetModelTest');
    require('./src/models/UserModelTest');

    require('./src/collections/BaseCollectionTest');
    require('./src/collections/AssetCollectionTest');

    afterAll(() => require('./mock/XhrMock').destroy());
  });
});

require('./src/util/ArrayUtilTest');
require('./src/util/ClassUtilTest');
require('./src/util/ObjectUtilTest');
require('./src/util/StringUtilTest');
