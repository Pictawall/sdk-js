'use strict';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;

require('./mock/XhrMock').init();

require('./src/appTest');

require('./src/models/EventModelTest');
require('./src/collections/AssetCollectionTest');
