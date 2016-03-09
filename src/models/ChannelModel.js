'use strict';

const BaseModel = require('./BaseModel');
const EventModel = require('./EventModel');
const SdkError = require('../core/Errors').SdkError;

/**
 * @classdesc <p>Model for pictawall channels.</p>
 */
class ChannelModel extends BaseModel {

  /**
   * <p>Creates a new Channel Model, you can fill it with server data by calling {@link #fetch}</p>
   *
   * @param {!Sdk} sdk The SDK in which this model is running.
   * @param {!String} channelId - The pictawall channel identifier.
   */
  constructor(sdk, channelId) {
    super(sdk);

    if (typeof channelId !== 'string') {
      return Promise.reject(new SdkError(this, `Channel identifier "${channelId}" is not valid.`));
    }

    this.setApiPath(`/channels/${channelId}`);
  }

  /**
   * Loads an event from the server.
   */
  setProperties(properties) {
    const eventProperties = properties.event;
    this._event = new EventModel(eventProperties.identifier);
    this._event.setProperties(eventProperties);

    return super.setProperties(properties);
  }

  /**
   *
   * @returns {EventModel|exports|module.exports|*}
   */
  get event() {
    return this._event;
  }

  parse(data) {
    return data.data;
  }
}

module.exports = ChannelModel;
