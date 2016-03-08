'use strict';

/**
 * @class Config
 *
 * <p>Default values are:</p>
 * <ul>
 *   <li>endpoint: 'https://api.pictawall.com'</li>
 * </ul>
 */
class Config {

  constructor() {
    this.parameters = new Map();

    this.parameters.set('endpoint', 'https://api.pictawall.com/v2.5');
  }

  /**
   * Returns the value of a configuration option or the default value if the option does not exist.
   *
   * @param {!string} parameterName The name of the configuration option to get.
   * @param {*} [defaultValue = null] The value to return if the option is not found.
   * @returns {*} The value of the configuration option.
   */
  get(parameterName, defaultValue = null) {
    if (this.parameters.has(parameterName)) {
      return this.parameters.get(parameterName);
    }

    return defaultValue;
  }

  /**
   * Sets a configuration option
   * @param {!string} parameterName The name of the configuration option to set.
   * @param {*} value The value of the option.
   */
  set(parameterName, value) {
    this.parameters.set(parameterName, value);
  }
}

Config.instance = new Config();
module.exports = Config;
