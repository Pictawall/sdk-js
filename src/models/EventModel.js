'use strict';

import BaseModel from './BaseModel';

import { SdkError } from '../core/Errors';

/**
 * @type {WeakMap.<EventModel, Map.<String, BaseCollection>>}
 */
const collectionLists = new WeakMap();

/**
 * Model for pictawall events.
 *
 * @class EventModel
 * @extends BaseModel
 */
class EventModel extends BaseModel {

  /**
   * <p>Creates a new Event model.</p>
   * <p>You can fill it with server data by calling {@link #fetch}</p>
   *
   * @param {!Sdk} sdk - The SDK in which this model is running.
   * @param {!String} identifier - The pictawall event identifier.
   * @param {Object} config - The constructor parameters.
   * @param {boolean} [config.autoUpdate = false] - Should the collections periodically fetch their contents ?
   * @param {number} [config.autoUpdateVelocity = 10000] - Time in ms between each auto-update.
   */
  constructor(sdk, identifier, /* config = */ { autoUpdate = false, autoUpdateVelocity = 10000 } = {}) {
    super(sdk);

    if (typeof identifier !== 'string') {
      throw new SdkError(this, `Event identifier "${identifier}" is not valid.`);
    }

    //this.autoUpdateVelocity = autoUpdateVelocity;

    this.setProperty('identifier', identifier);
    this.apiPath = `/events/${identifier}`;
    this.fetchParser = function (serverResponse) {
      return serverResponse.data;
    };

    collectionLists.set(this, new Map());
  }

  /**
   * Populates this model and its collections.
   */
  fetch(queryParameters) {
    return Promise.all([
      this.fetchCollections(),
      super.fetch(queryParameters)
    ]).then(() => {
      //if (autoUpdate) {
      //  this.startAutoUpdate();
      //}

      return this;
    });
  }

  fetchCollections() {
    const promises = [];

    collectionLists.get(this).forEach(collection => {
      promises.push(collection.fetch());
    });

    return Promise.all(promises);
  }

  /**
   * <p>Adds a collection to this model.</p>
   * <p>Collections aren't automatically added to give you more control on the collections themselves.</p>
   *
   * @param {!String} collectionName
   * @param {!BaseCollection} collection
   * @return {!this}
   *
   * @example
   * // split media and text assets in two different collections
   * event.addCollection('assetTextCollection', new AssetCollection(event, { limit: 100, orderBy: 'date_desc', kind: 'text' }))
   * event.addCollection('assetMediaCollection', new AssetCollection(event, { limit: 100, orderBy: 'date_desc', kind: 'text' }))
   */
  addCollection(collectionName, collection) {
    const collectionList = collectionLists.get(this);

    if (collectionList.has(collectionName)) {
      throw new SdkError(this, `Collection ${collectionName} already registered for this event`);
    }

    collectionList.set(collectionName, collection);

    return this;
  }

  getCollection(collectionName) {
    const collectionList = collectionLists.get(this);

    return collectionList.get(collectionName);
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

export default EventModel;
