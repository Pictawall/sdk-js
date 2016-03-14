'use strict';

import BaseCollection from '../collections/BaseCollection';
import MessageModel from '../models/MessageModel';

// TODO updateAll

/**
 * Collection of event messages.
 *
 * @class MessageCollection
 * @extends BaseCollection
 */
class MessageCollection extends BaseCollection {

  /**
   * @param {!EventModel} event The owning event.
   */
  constructor(event) {
    super(event.sdk);

    this.apiPath = `/events/${event.getProperty('identifier')}/ads/{adId}`;
    this.fetchParser = function (data) {
      return data.data;
    };
  }

  /**
   * @inheritDoc
   */
  createModel() {
    return new MessageModel(this.sdk);
  }
}

export default MessageCollection;

