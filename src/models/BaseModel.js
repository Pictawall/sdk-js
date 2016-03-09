'use strict';

const FetchMixin = require('../mixins/FetchMixin');
const ClassUtil = require('../util/ClassUtil');
const SdkError = require('../core/Errors').SdkError;

/**
 * @mixes FetchMixin
 */
class BaseModel {

  /**
   * @param {!Sdk} sdk The SDK in which this model is running.
   */
  constructor(sdk) {
    /**
     * Model properties, data returned by the server.
     * @type {JsonableMap}
     */
    this._properties = new Map();

    /**
     * The owning SDK.
     * @type {!Sdk}
     */
    this.sdk = sdk;
  }

  setProperties(newProperties) {
    if (typeof newProperties !== 'object') {
      throw new SdkError(this, `Invalid newProperties value "${newProperties}". This is the value returned by #parse(data).`);
    }

    this._properties.clear();

    for (let propertyName of Object.getOwnPropertyNames(newProperties)) {
      const property = newProperties[propertyName];

      this._properties.set(propertyName, property);
    }

    return this;
  }

  setProperty(propertyName, propertyValue) {
    this._properties.set(propertyName, propertyValue);
  }

  getProperty(propName) {
    return this._properties.get(propName);
  }

  toJSON() {
    return this._properties.toJSON();
  }

  fetch(queryParameters) {
    return this.fetchRaw(queryParameters)
      .then(data => {
        this.setProperties(data);
        return this;
      });
  }
}

ClassUtil.merge(BaseModel, FetchMixin);

module.exports = BaseModel;
