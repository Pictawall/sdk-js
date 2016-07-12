import UserModel from '../models/UserModel';
import PictawallPagedCollection from './abstract/PictawallPagedCollection';

/**
 * Collection of event users.
 *
 * @class UserCollection
 * @extends PictawallPagedCollection
 */
class UserCollection extends PictawallPagedCollection {

  /**
   * @param {!EventModel} event The owning event.
   */
  constructor(event) {
    super(event.sdk, 5, 'score');

    this._event = event;
    this.apiPath = `/events/${event.getProperty('identifier')}/users/{modelId}`;
  }

  /**
   * @inheritDoc
   */
  createModel() {
    return new UserModel(this._event);
  }
}

export default UserCollection;
