'use strict';


function mergeClass(receivingClass, givingPrototype) {
  if (givingPrototype === Object.prototype) {
    return;
  }

  // fetch inherited properties
  const givingPrototypeProto = Object.getPrototypeOf(givingPrototype);
  if (givingPrototype != null) {
    mergeClass(receivingClass, givingPrototypeProto);
  }

  const receivingPrototype = receivingClass.prototype;
  for (let propertyName of Object.getOwnPropertyNames(givingPrototype)) {
    if (propertyName === 'contructor') {
      continue;
    }

    receivingPrototype[propertyName] = givingPrototype[propertyName];
  }
}

/**
 * @class ClassUtil
 */
const ClassUtil = {

  /**
   * <p>Debug Tool</p>
   * <p>Returns the name of the class of an instance</p>
   *
   * @param {!any} instance An instance from which the class name will be fetched.
   * @returns {string} The name of the instance's class.
   */
  getName(instance) {
    const proto = Object.getPrototypeOf(instance);
    return proto.constructor ? proto.constructor.name : 'Unknown Class';
  },

  /**
   * <p>Adds methods retrieved from mixins to a function's prototype.</p>
   * <p>If the mixin is an object, all of its properties will be added to the receiving prototype.<br>
   *    If the mixin is a function, all of its prototype's properties will be added to the receiving prototype.<p>
   *
   * @param {!function} receivingClass function whose prototype will receive the mixins.
   * @param {!function|object|Array.<function|object>} mixins Objects or functions from which the method will be retrieved.
   * @returns {*}
   */
  merge(receivingClass, ...mixins) {
    for (let i = 0; i < mixins.length; i++) {
      const mixin = mixins[i];
      if (mixin == null) {
        throw new Error(`Invalid mixin n° ${i}`);
      }

      if (typeof mixin === 'object') {
        mergeClass(receivingClass, mixin);
      }

      if (typeof mixin === 'function') {
        mergeClass(receivingClass, mixin.prototype);
      }
    }

    return receivingClass;
  }
};

module.exports = ClassUtil;
