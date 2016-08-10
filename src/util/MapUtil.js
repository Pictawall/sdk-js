
/**
 * Utility class for map-related operations.
 *
 * @namespace MapUtil
 */
const MapUtil = {

  /**
   * @param {!Map} map
   */
  toJson(map) {
    const output = {};

    map.forEach((value, key) => {
      output[key] = value;
    });

    return output;
  }
};

export default MapUtil;
