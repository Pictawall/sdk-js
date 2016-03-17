'use strict';

module.exports = {
  assertModelLoaded(model, properties) {
    for (let propertyName of Object.getOwnPropertyNames(properties)) {
      expect(model.getProperty(propertyName)).toEqual(properties[propertyName])
    }
  }
};
