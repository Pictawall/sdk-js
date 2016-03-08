'use strict';

const BaseCollection = require('../collections/BaseCollection');
const AdModel = require('../models/AdModel');

// TODO updateAll

class AdCollection extends BaseCollection {

  /**
   * @param {!ChannelModel} event The owning event.
   */
  constructor(event) {
    super();

    this.setApiPath(`/events/${event.getProperty('identifier')}/ads/{adId}`);
  }

  /**
   * Parses the response from the server and returns the data to use for model creation.
   *
   * @override
   */
  parse(data) {
    data = super.parse(data);

    return data.data;
  }

  /**
   * Model method factory.
   */
  createModel() {
    return new AdModel();
  }
}

module.exports = AdCollection;

