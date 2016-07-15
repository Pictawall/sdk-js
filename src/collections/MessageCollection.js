import MessageModel from '../models/MessageModel';
import PictawallCollection from './abstract/PictawallCollection';

/**
 * Collection of event messages.
 *
 * @class MessageCollection
 * @extends PictawallCollection
 */
class MessageCollection extends PictawallCollection {

  /**
   * @param {!EventModel} event The owning event.
   */
  constructor(event) {
    super(event.sdk);

    this.apiPath = `/events/${event.getProperty('identifier')}/messages/{modelId}`;
  }

  /**
   * @inheritDoc
   */
  createModel() {
    return new MessageModel(this.sdk);
  }
}

export default MessageCollection;

