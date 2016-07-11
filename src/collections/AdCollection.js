'use strict';

import BaseCollection from '../collections/BaseCollection';
import AdModel from '../models/AdModel';

/**
 * Collection of event ads.
 *
 * @class AdCollection
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

export default AdCollection;

