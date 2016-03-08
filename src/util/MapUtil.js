'use strict';

module.exports = {
  toJson(map) {
    const json = {};

    map.forEach((value, key) => {
      json[key] = value;
    });

    return json;
  }
};
