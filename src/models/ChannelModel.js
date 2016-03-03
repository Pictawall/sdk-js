'use strict';

const Model = require('ampersand-model');

const AssetCollection = require('../collections/AssetCollection');

const config = require('../services/Config');

// TODO contains an event
// Note: the event can change so autoupdate option + event
const ChannelModel = Model.extend({

  urlRoot() {
    return config.get('endpoint') + '/channels';
  }
});

module.exports = ChannelModel;
