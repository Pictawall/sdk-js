'use strict';

import Sdk from '../core/Sdk';
import { SdkError } from '../core/Errors';
import PictawallModel from './abstract/PictawallModel';

/**
 * @type {WeakMap.<EventModel, {
 *  collections: Map.<String, BaseCollection>,
 *  autoUpdate: boolean,
 *  autoUpdateTimeout: number
 * }>}
 */
const properties = new WeakMap();

/**
 * @param {!EventModel} self
 * @private
 */
function _runAutoUpdate(self) {
  const props = properties.get(self);
  if (!props.autoUpdate) {
    return;
  }

  props.autoUpdateTimeout = void 0;

  self.updateCollections().then(() => {
    props.autoUpdateTimeout = setTimeout(() => _runAutoUpdate(self), self.autoUpdateVelocity);
  });
}

/**
 * Model for pictawall events.
 *
 * @class EventModel
 * @extends PictawallModel
 */
class EventModel extends PictawallModel {

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
  constructor(sdk, identifier, /* config = */ { autoUpdate = false, autoUpdateVelocity = 15000 } = {}) {
    super(sdk);

    if (typeof identifier !== 'string' || !/^[a-z0-9\-_]+$/i.test(identifier)) {
      throw new SdkError(this, `Event identifier "${identifier}" is not valid.`);
    }

    this.setProperty('identifier', identifier);
    this.apiPath = `/events/${identifier}`;

    this.autoUpdateVelocity = autoUpdateVelocity;

    properties.set(this, {
      collections: new Map(),
      autoUpdate
    });
  }

  fetchCollections() {
    const promises = [];

    properties.get(this).collections.forEach(collection => {
      promises.push(collection.fetch());
    });

    return Sdk.Promise.all(promises);
  }

  /**
   * <p>Adds a collection to this model.</p>
   * <p>Collections aren't automatically added to give you more control on the collections themselves.</p>
   *
   * @param {!String} collectionName
   * @param {!BaseCollection} collection
   * @return {!EventModel}
   *
   * @example
   * // split media and text assets in two different collections
   * event.addCollection('assetTextCollection', new AssetCollection(event, { limit: 100, orderBy: 'date_desc', kind: 'text' }))
   * event.addCollection('assetMediaCollection', new AssetCollection(event, { limit: 100, orderBy: 'date_desc', kind: 'text' }))
   */
  addCollection(collectionName, collection) {
    const collectionList = properties.get(this).collections;

    if (collectionList.has(collectionName)) {
      throw new SdkError(this, `Collection ${collectionName} already registered for this event`);
    }

    collectionList.set(collectionName, collection);

    return this;
  }

  getCollection(collectionName) {
    return properties.get(this).collections.get(collectionName);
  }

  updateCollections() {
    const props = properties.get(this);

    const promises = [];
    props.collections.forEach(collection => promises.push(collection.update()));

    return Promise.all(promises);
  }

  set autoUpdate(autoUpdate) {
    autoUpdate = !!autoUpdate;

    const props = properties.get(this);
    if (props.autoUpdate === autoUpdate) {
      return;
    }

    props.autoUpdate = autoUpdate;

    if (!autoUpdate) {
      if (props.autoUpdateTimeout) {
        clearTimeout(props.autoUpdateTimeout);
        props.autoUpdateTimeout = void 0;
      }
    } else {
      _runAutoUpdate(this);
    }
  }

  get autoUpdate() {
    return properties.get(this).autoUpdate;
  }

  /**
   * @inheritDoc
   */
  get type() {
    return 'event';
  }
}

export default EventModel;
