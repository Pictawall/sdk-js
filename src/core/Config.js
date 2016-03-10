'use strict';

/**
 * @class Config
 */
class Config {

  constructor() {
    this._parameters = new Map();
  }

  /**
   * Returns the value of a configuration option or the default value if the option does not exist.
   *
   * @param {!string} parameterName The name of the configuration option to get.
   * @param {*} [defaultValue = null] The value to return if the option is not found.
   * @returns {*} The value of the configuration option.
   */
  get(parameterName, defaultValue = null) {
    if (this._parameters.has(parameterName)) {
      return this._parameters.get(parameterName);
    }

    return defaultValue;
  }

  /**
   * Sets a configuration option
   * @param {!string} parameterName The name of the configuration option to set.
   * @param {*} value The value of the option.
   */
  set(parameterName, value) {
    this._parameters.set(parameterName, value);
  }
}

module.exports = Config;
