'use strict';

const EventModel = require('../../src/models/EventModel');
const ChannelModel = require('../../src/models/ChannelModel');
const Config = require('../../src/services/Config');
const packageJson = require('../../package.json');

describe('Pictawall SDK', () => {

  it('Is importable', () => {
    require('../../src/app');

    expect(window.pictawall.SDK).toBeDefined();
    expect(window.pictawall.SDK.Models.Event).toBe(EventModel);
    expect(window.pictawall.SDK.Models.Channel).toBe(ChannelModel);
    expect(window.pictawall.SDK.version).toBe(packageJson.version);
    expect(window.pictawall.SDK.config).toBe(Config.instance);
  });
});
