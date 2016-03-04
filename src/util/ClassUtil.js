'use strict';

module.exports = {
  getName(instance) {
    const proto = Object.getPrototypeOf(instance);
    return proto.constructor ? proto.constructor.name : 'Unknown Class';
  }
};
