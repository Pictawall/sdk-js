'use strict';

import BaseModel from './BaseModel';
import EventModel from './EventModel';
import { SdkError } from '../core/Errors';

/**
 * Model for pictawall channels.
 *
 * @class ChannelModel
 * @extends BaseModel
 */
class ChannelModel extends BaseModel {

  /**
   * <p>Creates a new Channel Model, you can fill it with server data by calling {@link #fetch}</p>
   *
   * @param {!Sdk} sdk The SDK in which this model is running.
   * @param {!String} channelId The pictawall channel identifier.
   * @param {Object} [eventConfig = {}] The config object to give as a third parameter to {@link EventModel#constructor}.
   */
  constructor(sdk, channelId, eventConfig) {
    super(sdk);

    if (typeof channelId !== 'string') {
      throw new SdkError(this, `Channel identifier "${channelId}" is not valid.`);
    }

    this._eventConfig = eventConfig;
    this.apiPath = `/channels/${channelId}`;
    this.fetchParser = function (serverResponse) {
      return serverResponse.data;
    };
  }

  /**
   * @inheritDoc
   */
  setProperties(properties) {
    const eventProperties = properties.event;
    this._event = new EventModel(this.sdk, eventProperties.identifier, this._eventConfig);
    this._event.setProperties(eventProperties);

    if (Array.isArray(properties.properties)) {
      properties.properties = {};
    }

    return super.setProperties(properties);
  }

  /**
   * Returns
   */
  get event() {
    return this._event;
  }

  /**
   * @inheritDoc
   */
  get type() {
    return 'channel';
  }
}

export default ChannelModel;
