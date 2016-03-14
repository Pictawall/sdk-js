'use strict';

import FetchMixin from '../mixins/FetchMixin';
import ClassUtil from '../util/ClassUtil';
import { SdkError } from '../core/Errors';

/**
 * Maps containing the properties of the models.
 * @type {WeakMap.<BaseModel, Map>}
 * @private
 */
const _propertyMaps = new WeakMap();

/**
 * <p>Default model, can fetch from the api and store the data.</p>
 * <p>Extend to add model-specific functionality.</p>
 *
 * @class BaseModel
 * @mixes FetchMixin
 */
class BaseModel {

  /**
   * @param {!Sdk} sdk The SDK in which this model is running.
   */
  constructor(sdk) {
    _propertyMaps.set(this, new Map());

    /**
     * The instance of the SDK that created this model.
     * @type {!Sdk}
     * @readonly
     */
    this.sdk = sdk;
  }

  /**
   * Initializes the properties of the model.
   *
   * @param {!object} newProperties The set of properties to put in the model. Pre-existing ones will be overwritten.
   * @returns {!BaseModel} this.
   */
  setProperties(newProperties) {
    if (typeof newProperties !== 'object') {
      throw new SdkError(this, `Invalid newProperties value "${newProperties}". This might be due to the server returning an invalid value, you can modify it using a fetch parser.`);
    }

    const propertyMap = _propertyMaps.get(this);
    propertyMap.clear();

    for (let propertyName of Object.getOwnPropertyNames(newProperties)) {
      const property = newProperties[propertyName];

      propertyMap.set(propertyName, property);
    }

    return this;
  }

  /**
   * Sets a property of the model.
   *
   * @param {!string} propertyName The name of the property to set.
   * @param {!*} propertyValue The value to set the property to.
   *
   * @return {!BaseModel} this.
   */
  setProperty(propertyName, propertyValue) {
    _propertyMaps.get(this).set(propertyName, propertyValue);
    return this;
  }

  /**
   * Returns the value of a property or undefined if such property does not exist.
   *
   * @param {!string} propertyName The name of the property to retrieve.
   * @returns {*}
   */
  getProperty(propertyName) {
    return _propertyMaps.get(this).get(propertyName);
  }

  toJSON() {
    return _propertyMaps.get(this).toJSON();
  }

  /**
   * Retrieves the model's properties from the API.
   *
   * @param {object} [queryParameters] Query parameters to add the the HTTP request.
   * @returns {Promise.<BaseModel>} A promise that resolves this once the properties have been set.
   */
  fetch(queryParameters) {
    return this.fetchRaw(queryParameters)
      .then(data => {
        this.setProperties(data);
        return this;
      });
  }
}

ClassUtil.merge(BaseModel, FetchMixin);

export default BaseModel;
