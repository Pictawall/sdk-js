'use strict';

import UserModel from './UserModel';
import Sdk from '../core/Sdk';

import { SdkError } from '../core/Errors';
import PictawallModel from './abstract/PictawallModel';

/**
 * Asset model.
 *
 * @class AssetModel
 * @extends PictawallModel
 */
class AssetModel extends PictawallModel {

  /**
   * @param {!EventModel} event The owning event model.
   */
  constructor(event) {
    super(event.sdk);

    if (typeof event !== 'object') {
      throw new SdkError(this, 'event must be an EventModel.');
    }

    /**
     * @type {!EventModel}
     * @private
     */
    this._event = event;
    this.parseResponse = data => data.data;
  }

  /**
   * @inheritDoc
   */
  setProperties(properties) {
    // hotfix api bug, thx php.
    if (Array.isArray(properties.source.additionalData)) {
      properties.source.additionalData = {};
    }

    const userCollection = this._event.getCollection('users');
    this._owner = userCollection != null ? userCollection.findOne({ id: properties.owner.id }) : null;

    if (this._owner === null) {
      const owner = new UserModel(this._event);
      owner.setProperties(properties.owner);

      if (userCollection != null) {
        this._owner = userCollection.add(owner, false, false);
      } else {
        this._owner = owner;
      }
    }

    this.apiPath = `/events/${this._event.getProperty('identifier')}/assets/${properties.id}`;

    return super.setProperties(properties);
  }

  /**
   * @inheritDoc
   */
  setProperty(name, value) {
    if (name === 'id') {
      this.apiPath = `/events/${this._event.getProperty('identifier')}/assets/${value}`;
    }

    super.setProperty(name, value);
  }

  /**
   * The model of the user who created the asset.
   *
   * @readonly
   * @type {!UserModel}
   */
  get owner() {
    return this._owner;
  }

  /**
   * Call this method if the media.default url points to a dead link.
   *
   * @return {!Promise.<this>}
   */
  markMediaAsDead() {
    return this.sdk.callApi(`${this.apiPath}/check`, { method: 'PATCH' }).then(() => this);
  }

  /**
   * Determines whether or not this asset is considered safe.
   *
   * @readonly
   * @type {!boolean}
   */
  get isSafe() {
    return this.getProperty('isSafe');
  }

  /**
   * Report the asset for moderation.
   * This method will reject if the asset property "isSafe" is set to true.
   *
   * @returns {!Promise.<this>}
   * @throws {SdkError} The asset is considered safe.
   */
  report() {
    if (this.isSafe) {
      return Sdk.Promise.resolve(this);
    }

    return this.sdk.callApi(`${this.apiPath}/report`, { method: 'PATCH' }).then(() => this);
  }

  /**
   * @inheritDoc
   */
  get type() {
    return 'asset';
  }
}

export default AssetModel;
