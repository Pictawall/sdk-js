'use strict';

const BaseCollection = require('../collections/BaseCollection');
const AdModel = require('../models/AdModel');

// TODO updateAll

/**
 * Collection of event ads.
 *
 * @extends BaseCollection
 */
class AdCollection extends BaseCollection {

  /**
   * @param {!EventModel} event The owning event.
   */
  constructor(event) {
    super(event.sdk);

    this.apiPath = `/events/${event.getProperty('identifier')}/ads/{adId}`;
    this.fetchParser = (response => response.data);
  }

  /**
   * @inheritDoc
   */
  createModel() {
    return new AdModel(this.sdk);
  }
}

module.exports = AdCollection;

