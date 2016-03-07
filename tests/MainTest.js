'use strict';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 2500;

require('./mock/XhrMock').init();

describe('SDK', () => {
  beforeEach(() => {
    console.log();
    console.log('New jasmine test');
  });

  require('./src/appTest');

  require('./src/mixins/MongoQuery/MongoCursorTest');

  require('./src/models/EventModelTest');
  require('./src/collections/AssetCollectionTest');
});
