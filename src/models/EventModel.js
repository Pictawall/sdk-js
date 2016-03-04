'use strict';

const BaseModel = require('./BaseModel');
const AssetCollection = require('../collections/AssetCollection');

/**
 * @classdesc <p>Model for pictawall events.</p>
 */
class EventModel extends BaseModel {

  /**
   * <p>Creates a new Event model and its associated collections.</p>
   *
   * @param {!Object} config - The constructor parameters.
   * @param {!String} config.identifier - The pictawall event identifier.
   * @param {!boolean} [config.autoUpdate = false] - Should the collections periodically fetch their contents ?
   * @param {!number} [config.autoUpdateVelocity = 10000] - Time in ms between each auto-update.
   * @return {Promise.<this>}
   */
  constructor(/* config = */ { identifier, autoUpdate = false, autoUpdateVelocity = 10000, assetBatchSize = 100 } = {}) {
    super();

    if (typeof identifier !== 'string') {
      return Promise.reject(new Error(`Event identifier "${identifier}" is not valid.`));
    }

    //this.autoUpdateVelocity = autoUpdateVelocity;

    this.setProperty('identifier', identifier);
    this.setApiPath(`/events/${identifier}`);
    this.assetCollection = new AssetCollection(this, assetBatchSize);

    return Promise.all([
      this.fetch(),
      this.assetCollection.loadMore()
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

  parse(data) {
    return data.data;
  }
}

module.exports = EventModel;
