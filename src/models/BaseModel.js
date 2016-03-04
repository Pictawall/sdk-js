'use strict';

const MapUtil = require('../util/MapUtil');
const FetchMixin = require('../mixins/FetchMixin');
const merge = require('../util/merge');

/**
 * @mixes FetchMixin
 */
class BaseModel {

  constructor() {
    /**
     * Model properties, data returned by the server.
     * @type {JsonableMap}
     */
    this._properties = new Map();
  }

  _setProperties(newProperties) {
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

  toJson() {
    return MapUtil.toJson(this._properties);
  }

  fetch(queryParameters) {
    return this.fetchRaw(queryParameters)
      .then(data => {
        this._setProperties(data);
        return this;
      });
  }
}

merge(BaseModel, FetchMixin);

module.exports = BaseModel;
