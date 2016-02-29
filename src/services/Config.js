'use strict';

class Config {

  constructor() {
    this.parameters = new Map();

    this.parameters.set('endpoint', 'https://api.pictawall.com');
    this.parameters.set('limit', 100);
  }

  get(parameterName, defaultValue = null) {
    if (this.parameters.has(parameterName)) {
      return this.parameters.get(parameterName);
    }

    return defaultValue;
  }

  set(parameter, value) {
    this.parameters.set(parameter, value);
  }
}

module.exports = new Config();
