'use strict';

const BaseModel = require('./BaseModel');
const AssetCollection = require('../collections/AssetCollection');
const UserCollection = require('../collections/UserCollection');
const AdCollection = require('../collections/AdCollection');
const MessageCollection = require('../collections/MessageCollection');

const SdkError = require('../core/Errors').SdkError;

/**
 * Model for pictawall events.
 */
class EventModel extends BaseModel {

  /**
   * <p>Creates a new Event model and its associated collections.</p>
   * <p>You can fill it with server data by calling {@link #fetch}</p>
   *
   * @param {!Sdk} sdk - The SDK in which this model is running.
   * @param {!String} identifier - The pictawall event identifier.
   * @param {!Object} config - The constructor parameters.
   * @param {!boolean} [config.autoUpdate = false] - Should the collections periodically fetch their contents ?
   * @param {!number} [config.autoUpdateVelocity = 10000] - Time in ms between each auto-update.
   */
  constructor(sdk, identifier, /* config = */ { autoUpdate = false, autoUpdateVelocity = 10000, assetBatchSize = 100 } = {}) {
    super(sdk);

    if (typeof identifier !== 'string') {
      throw new SdkError(this, `Event identifier "${identifier}" is not valid.`);
    }

    //this.autoUpdateVelocity = autoUpdateVelocity;

    this.setProperty('identifier', identifier);
    this.setApiPath(`/events/${identifier}`);
    this.fetchParser = function (serverResponse) {
      return serverResponse.data;
    };

    this.userCollection = new UserCollection(this);
    this.assetCollection = new AssetCollection(this, assetBatchSize);
    this.adCollection = new AdCollection(this);
    this.messageCollection = new MessageCollection(this);
  }

  /**
   * @inheritDoc
   */
  fetch(queryParameters) {
    return Promise.all([
      super.fetch(queryParameters),
      this.userCollection.fetch(),
      this.assetCollection.fetch(),
      this.adCollection.fetch(),
      this.messageCollection.fetch()
    ]).then(() => {
      //if (autoUpdate) {
      //  this.startAutoUpdate();
      //}

      return this;
    });
  }

  //_runAutoUpdate() {
  //  if (!this._autoUpdate){
  //    return;
  //  }
  //
  //  this.update().then(() => {
  //    setTimeout(() => this._runAutoUpdate(), this.autoUpdateVelocity);
  //  });
  //}

  //updateAll() {
  //  return Promise.all([
  //    this.fetch(),
  //    this.assetCollection.loadMore()
  //  ]);
  //}
  //
  //stopAutoUpdate() {
  //  this._autoUpdate = false;
  //}
  //
  //startAutoUpdate() {
  //  this._autoUpdate = true;
  //  this._runAutoUpdate();
  //}
}

module.exports = EventModel;
