'use strict';

/**
 * Utility class for object-related operations.
 *
 * @namespace ObjectUtil
 */
const ObjectUtil = {

  /**
   * <p>Safely finds a property in an object. No risk of any reference error occuring.</p>
   *
   * @param {!Object} container The container in which the search will occur.
   * @param {!String} propertyName The name of the property to find. Dots are used as separators for subproperties, e.g. 'document.head' does not mean container['document.head'] but container.document.head
   * @returns {*}
   *
   * @example
   * ObjectUtil.find(window, 'document.head') // is translated to window.document.head, head is returned.
   *
   * @example
   * ObjectUtil.find(window, 'pictawall.SDK.version') // returns version if window.pictawall.SDK.version exists, undefined otherwise.
   */
  find(container, propertyName) {
    // add support for \ escaping the dot in case someone decided added a . in their actual property name is a good idea ?
    const names = propertyName.split('.');

    for (let i = 0; i < names.length; i++) {
      if (container === void 0) {
        return void 0;
      }

      container = container[names[i]];
    }

    return container;
  },

  /**
   * <p>Returns whether or not a property exists in an object</p>
   *
   * @param {!Object} container The container in which the search will occur.
   * @param {!String} propertyName The name of the property to find. Dots are used as separators for subproperties, e.g. 'document.head' does not mean container['document.head'] but container.document.head
   * @returns {boolean}
   */
  exists(container, propertyName) {
    return this.find(container, propertyName) !== void 0;
  },

  get global() {
    if (typeof window !== 'undefined') {
      return window;
    }

    if (typeof global !== 'undefined') {
      return global;
    }
  }
};

export default ObjectUtil;
