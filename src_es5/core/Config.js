'use strict';

/**
 * @class Config
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Config = function () {
  function Config() {
    _classCallCheck(this, Config);

    this.parameters = new Map();
  }

  /**
   * Returns the value of a configuration option or the default value if the option does not exist.
   *
   * @param {!string} parameterName The name of the configuration option to get.
   * @param {*} [defaultValue = null] The value to return if the option is not found.
   * @returns {*} The value of the configuration option.
   */


  _createClass(Config, [{
    key: 'get',
    value: function get(parameterName) {
      var defaultValue = arguments.length <= 1 || arguments[1] === void 0 ? null : arguments[1];

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

  }, {
    key: 'set',
    value: function set(parameterName, value) {
      this.parameters.set(parameterName, value);
    }
  }]);

  return Config;
}();

module.exports = Config;