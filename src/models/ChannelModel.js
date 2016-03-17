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
   * @param {!String} channelId - The pictawall channel identifier.
   */
  constructor(sdk, channelId) {
    super(sdk);

    if (typeof channelId !== 'string') {
      throw new SdkError(this, `Channel identifier "${channelId}" is not valid.`);
    }

    this.apiPath = `/channels/${channelId}`;
    this.fetchParser = function (serverResponse) {
      return serverResponse.data;
    };
  }

  /**
   * @inheritDoc
   */
  fetch(queryParameters) {
    return super.fetch(queryParameters)
      .then(() => this._event.fetchCollections())
      .then(() => this);
  }

  /**
   * @inheritDoc
   */
  setProperties(properties) {
    const eventProperties = properties.event;
    this._event = new EventModel(this.sdk, eventProperties.identifier);
    this._event.setProperties(eventProperties);

    return super.setProperties(properties);
  }

  /**
   * Returns
   */
  get event() {
    return this._event;
  }
}

export default ChannelModel;
