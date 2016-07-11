'use strict';

import BaseCollection from '../collections/BaseCollection';
import MessageModel from '../models/MessageModel';

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

    this.apiPath = `/events/${event.getProperty('identifier')}/messages/{messageId}`;
    this.fetchParser = (response => response.data);
  }

  /**
   * @inheritDoc
   */
  createModel() {
    return new MessageModel(this.sdk);
  }
}

export default MessageCollection;

