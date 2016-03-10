'use strict';

const BaseModel = require('./BaseModel');
const SdkError = require('../core/Errors').SdkError;

/**
 * Asset model.
 */
class AssetModel extends BaseModel {

  /**
   * @param {ChannelModel} event The owning event model.
   */
  constructor(event) {
    super(event.sdk);

    if (typeof event !== 'object') {
      throw new SdkError(this, 'event must be an EventModel.');
    }

    /**
     * @type {ChannelModel}
     */
    this._event = event;
  }

  /**
   * @inheritDoc
   */
  setProperties(properties) {
    // hotfix api bug, thx php.
    if (Array.isArray(properties.source.additionalData)) {
      properties.source.additionalData = {};
    }

    const userCollection = this._event.userCollection;
    this._owner = userCollection.findOne({ id: properties.owner.id });
    if (this._owner === null) {
      const owner = userCollection.createModel(properties.owner);
      owner.setProperties(properties.owner);

      this._owner = userCollection.add(owner, false, false);
    }

    this.setApiPath(`/events/${this._event.identifier}/assets/${properties.id}`);

    return super.setProperties(properties);
  }

  /**
   * @return {!UserModel}
   */
  get owner() {
    return this._owner;
  }

  /**
   * Call this method if the media.default url points to a dead link.
   */
  markMediaAsDead() {
    // TODO NYI
    // PATCH assets/id/check/
  }

  /**
   * Report the asset for moderation.
   */
  report() {
    if (this.getProperty('isSafe')) {
      return;
    }

    // TODO NYI
    // PATCH assets/id/report
  }
}

module.exports = AssetModel;
