import ClassUtil from '../../util/ClassUtil';
import { SdkError } from '../../core/Errors';
import FetchMixin, { Symbols as FetchSymbols } from '../../mixins/FetchMixin';
import FindMixin from '../../mixins/FindMixin';
import Sdk from '../../core/Sdk';

export const Symbols = {
  getUpdatedItems: Symbol('getUpdatedItems')
};

/**
 * @typedef {!Object} BaseCollectionProperties
 * @property {!Array.<BaseModel>} models
 * @property {!boolean} loaded
 * @property {!number} lastUpdate - Unix timestamp of the last collection synchronisation.
 */

/**
 * Private properties
 * @type {WeakMap.<BaseCollection, BaseCollectionProperties>}
 * @private
 */
const instances = new WeakMap();

/**
 * @class BaseCollection
 *
 * @mixes FetchMixin
 * @mixes FindMixin
 * @implements Iterable
 *
 * @property {!Sdk} sdk
 * @property {!function} createModel
 */
class BaseCollection {

  /**
   * @param {!Sdk} sdk
   */
  constructor(sdk) {
    if (sdk === void 0) {
      throw new SdkError(this, 'This model did not receive a SDK instance.');
    }

    ClassUtil.defineFinal(this, 'sdk', sdk);
    instances.set(this, {
      lastUpdate: -1,
      loaded: false,
      models: []
    });
  }

  /**
   * Parses the data retrieved by {@link FetchMixin#fetchRaw}.
   *
   * @param {!*} serverResponse The data fetched from the server, as an object.
   * @return {!*} The parsed data, to use to populate the model / collection.
   */
  [FetchSymbols.parseResponse](serverResponse) {
    instances.get(this).lastUpdate = serverResponse.since || (Date.now() / 1000);

    return serverResponse;
  }

  /**
   * Creates a model using the {@link #createModel} factory, then sets its properties.
   *
   * @param {!object} modelData Initialisation data for the model.
   * @returns {!BaseModel}
   */
  buildModel(modelData) {
    const model = this.createModel();
    model.setProperties(modelData);

    return model;
  }

  /**
   * Downloads and populates the collection.
   * @returns {!BaseCollection} this
   */
  async fetch() {
    if (!this.hasMore) {
      throw new SdkError(this, '#fetch called but #hasMore returns false');
    }

    const modelsData = await this.fetchRaw(this.fetchOptions);

    if (!Array.isArray(modelsData)) {
      throw new SdkError(this, `Invalid response from the http API. Should have returned array, got "${JSON.stringify(modelsData)}"`);
    }

    modelsData.forEach(data => {
      this.add(this.buildModel(data), true);
    });

    instances.get(this).loaded = true;

    return this;
  }

  /**
   * Loads the assets that have been added to the server database after the collection was loaded and removes those deleted.
   * Note: This will make the index jump as it will add data at the front of the collection.
   *
   * @return {!number} The amount of items added to the collection.
   */
  async update() {
    const initialCollectionSize = this.length;

    if (!this.loaded) {
      await this.fetch();
    } else {
      const lastUpdate = instances.get(this).lastUpdate;

      const { added, removed } = await (this[Symbols.getUpdatedItems] ? this[Symbols.getUpdatedItems](lastUpdate) : {});

      if (removed) {
        removed.forEach(id => this.remove(id));
      }

      if (added) {
        added.forEach(item => this.add(item, false, true));
      }
    }

    return this.length - initialCollectionSize;
  }

  /**
   * Retrieves the model matching the passed ID.
   *
   * @param {!number} modelId - The ID of the model to fetch.
   * @returns {!BaseModel}
   */
  async fetchById(modelId) {
    const modelData = await this.fetchRaw(null, { modelId });
    return this.add(this.buildModel(modelData));
  }

  /**
   * Adds a model to the collection.
   *
   * @param model
   * @param {boolean} [replace = true] If a model with the same ID already exists, overwrite it if true. Ignore the new model if false.
   * @param {boolean} [prepend = false] Insert the model at the beginning of the collection. // TODO auto sort with a comparator
   *
   * @return {!BaseModel} The model that was actually added (Could be the already existing model if replace is false and the id already exists).
   */
  add(newModel, replace = true, prepend = false) {

    const properties = instances.get(this);

    const index = properties.loaded ? properties.models.findIndex(model => model.id === newModel.id) : -1;

    if (index === -1) {
      if (prepend) {
        properties.models.unshift(newModel);
      } else {
        properties.models.push(newModel);
      }

      return newModel;
    }

    if (replace) {
      properties.models[index] = newModel;
      return newModel;
    } else {
      return properties.models[index];
    }
  }

  /**
   * Removes an item based on its identifier.
   * @param modelId - The model identifier.
   * @return {BaseModel} The model that was removed, or null if none was.
   */
  remove(modelId) {
    const properties = instances.get(this);

    const index = properties.models.findIndex(element => element.id === modelId);

    if (index === -1) {
      return null;
    }

    return properties.models.splice(index, 1)[0];
  }

  toJSON() {
    return instances.get(this).models;
  }

  /**
   * Returns the query parameters to add to a fetch api calls.
   * @returns {Object}
   */
  get fetchOptions() {
    return {};
  }

  /**
   * Returns the size of the collection.
   * @returns {!Number}
   */
  get length() {
    return instances.get(this).models.length;
  }

  /**
   * Whether or not the collection has been loaded, even partly, or not.
   * @returns {boolean}
   */
  get loaded() {
    return instances.get(this).loaded;
  }

  /**
   * Whether or not the is data to load from the server using {@link BaseCollection#fetch}.
   * @returns {!boolean}
   */
  get hasMore() {
    return !this.loaded;
  }

  /**
   * <p>Returns the model at the requested position in the collection.</p>
   * <p>Undefined will be returned if the position is out of bounds.</p>
   *
   * @param {!number} pos The position of the model in the collection.
   * @returns {BaseModel}
   */
  at(pos) {
    return instances.get(this).models[pos];
  }

  *[Symbol.iterator]() {
    for (let i = 0; i < this.length; i++) {
      yield this.at(i);
    }
  }
}

ClassUtil.defineAbstract(BaseCollection, 'createModel');
ClassUtil.merge(BaseCollection, FetchMixin, FindMixin);

export default BaseCollection;
