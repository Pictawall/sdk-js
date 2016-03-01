'use strict';

const Model = require('ampersand-model');
const SyncPromise = require('ampersand-sync-with-promise');

const AssetCollection = require('../collections/AssetCollection');

const config = require('../services/Config');

// TODO contains an event
// Note: the event can change so autoupdate option + event
const EventModel = Model.extend({

  sync: SyncPromise,
  urlRoot() {
    return config.get('endpoint') + '/channels';
  }
});

module.exports = EventModel;
