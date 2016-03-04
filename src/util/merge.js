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

function merge(receivingClass, ...mixins) {
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

module.exports = merge;
