'use strict';

const BaseModel = require('./BaseModel');
const EventModel = require('./EventModel');

class AssetModel extends BaseModel {

  /**
   * @param {EventModel} event The owning event model.
   */
  constructor(event) {
    super();

    if (!(event instanceof EventModel)) {
      throw new Error('event must be an EventModel.');
    }

    /**
     * @type {EventModel}
     */
    this._event = event;
  }

  setProperties(properties) {
    // hotfix api bug, thx php.
    if (Array.isArray(properties.source.additionalData)) {
      properties.source.additionalData = {};
    }

    this.setApiPath(AssetModel.getApiUrl(this._event.identifier, properties.id));

    return super._setProperties(properties);
  }

  ///**
  // * @return {EventModel}
  // */
  //get event() {
  //  return this._event;
  //}
  //
  ///**
  // * @return {UserModel}
  // */
  //get owner() {
  //
  //}

  ///**
  // * Call this method if the owner.avatar url points to a dead link.
  // *
  // * @memberOf UserModel
  // * @instance
  // */
  //markAvatarAsDead() {
  //  // TODO NYI
  //  // PATCH assets/id/check/user
  //}
  //
  ///**
  // * Call this method if the media.default url points to a dead link.
  // *
  // * @memberOf UserModel
  // * @instance
  // */
  //markMediaAdDead() {
  //  // TODO NYI
  //  // PATCH assets/id/check/
  //}
  //
  ///**
  // * Report the asset for moderation.
  // *
  // * @memberOf UserModel
  // * @instance
  // */
  //report() {
  //  if (this.isSafe) {
  //    return;
  //  }
  //
  //  // TODO NYI
  //  // PATCH assets/id/report
  //}

  static getApiUrl(eventIdentifier, assetId) {
    return `/events/${eventIdentifier}/assets/${assetId}`;
  }
}

module.exports = AssetModel;
