"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Utility class for map-related operations.
 *
 * @namespace MapUtil
 */
var MapUtil = {

  /**
   * @param {!Map} map
   */
  toJson: function toJson(map) {
    var output = {};

    map.forEach(function (value, key) {
      output[key] = value;
    });

    return output;
  }
};

exports.default = MapUtil;