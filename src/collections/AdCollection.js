import AdModel from '../models/AdModel';
import PictawallCollection from './abstract/PictawallCollection';
import updateReplaceMixin from '../mixins/updateReplaceMixin';
import ClassUtil from '../util/ClassUtil';

/**
 * Collection of event ads.
 *
 * @class AdCollection
 * @extends PictawallCollection
 */
class AdCollection extends PictawallCollection {

  /**
   * @param {!EventModel} event The owning event.
   */
  constructor(event) {
    super(event.sdk);

    this.apiPath = `/events/${event.getProperty('identifier')}/ads/{modelId}`;
  }

  /**
   * @inheritDoc
   */
  createModel() {
    return new AdModel(this.sdk);
  }
}

ClassUtil.merge(AdCollection, updateReplaceMixin);

export default AdCollection;

