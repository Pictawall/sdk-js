'use strict';

import { PictawallError } from '../core/Errors';

export const Symbols = {
  disableSymbolMerge: Symbol('disableSymbolMerge')
};

function _mergeClass(receivingClass, givingPrototype) {
  if (givingPrototype === Object.prototype) {
    return;
  }

  // fetch inherited properties
  const givingPrototypeProto = Object.getPrototypeOf(givingPrototype);
  if (givingPrototype != null) {
    _mergeClass(receivingClass, givingPrototypeProto);
  }

  const receivingPrototype = receivingClass.prototype;
  Object.getOwnPropertyNames(givingPrototype).forEach(propertyName => {
    if (propertyName === 'constructor') {
      return;
    }

    if (Object.getOwnPropertyDescriptor(receivingPrototype, propertyName) !== void 0) {
      throw new PictawallError(ClassUtil, `Merge error, method ${propertyName} is already in the receiving prototype.`);
    }

    Object.defineProperty(receivingPrototype, propertyName, Object.getOwnPropertyDescriptor(givingPrototype, propertyName));
  });

  if (givingPrototype[Symbols.disableSymbolMerge] !== true) {
    const symbols = Object.getOwnPropertySymbols(givingPrototype);

    symbols.forEach(symbol => {
      Object.defineProperty(receivingPrototype, symbol, Object.getOwnPropertyDescriptor(givingPrototype, symbol));
    });
  }
}

/**
 * Utility class for function-related operations.
 *
 * @namespace ClassUtil
 */
const ClassUtil = {

  /**
   * <p>Debug Tool</p>
   * <p>Returns the name of the class of an instance</p>
   *
   * @param {object} instance An instance from which the class name will be fetched.
   * @returns {string} The name of the instance's class.
   */
  getName(instance) {
    if (instance == null) {
      return String(instance);
    }

    let name;
    if (typeof instance === 'function') {
      name = instance.name;
    } else {
      const proto = Object.getPrototypeOf(instance);
      name = proto.constructor.name;
    }

    return name ? name : 'nameless';
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
    if (typeof receivingClass !== 'function') {
      throw new Errors.SdkError(this, 'Receiving Class is not a function');
    }

    for (let i = 0; i < mixins.length; i++) {
      const mixin = mixins[i];
      if (mixin == null) {
        throw new Errors.SdkError(this, `Invalid mixin n° ${i}, not defined.`);
      }

      if (typeof mixin === 'object') {
        _mergeClass(receivingClass, mixin);
      } else if (typeof mixin === 'function') {
        _mergeClass(receivingClass, mixin.prototype);
      } else {
        throw new Errors.SdkError(this, `Invalid type for mixin n° ${i}, only functions and objects are accepted as mixins.`);
      }
    }

    return receivingClass;
  }
};

export default Object.freeze(ClassUtil);
