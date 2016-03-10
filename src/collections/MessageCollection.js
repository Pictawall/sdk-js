'use strict';

const BaseCollection = require('../collections/BaseCollection');
const MessageModel = require('../models/MessageModel');

// TODO updateAll

/**
 * Collection of event messages.
 */
class MessageCollection extends BaseCollection {

  /**
   * @param {!EventModel} event The owning event.
   */
  constructor(event) {
    super(event.sdk);

    this.setApiPath(`/events/${event.getProperty('identifier')}/ads/{adId}`);
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

module.exports = MessageCollection;

