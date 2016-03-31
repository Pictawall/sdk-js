'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _Errors = require('../core/Errors');

function _mergeClass(receivingClass, givingPrototype) {
  if (givingPrototype === Object.prototype) {
    return;
  }

  // fetch inherited properties
  var givingPrototypeProto = Object.getPrototypeOf(givingPrototype);
  if (givingPrototype != null) {
    _mergeClass(receivingClass, givingPrototypeProto);
  }

  var receivingPrototype = receivingClass.prototype;
  Object.getOwnPropertyNames(givingPrototype).forEach(function (propertyName) {
    if (propertyName === 'constructor') {
      return;
    }

    if (Object.getOwnPropertyDescriptor(receivingPrototype, propertyName) !== void 0) {
      throw new _Errors.PictawallError(ClassUtil, 'Merge error, method ' + propertyName + ' is already in the receiving prototype.');
    }

    Object.defineProperty(receivingPrototype, propertyName, Object.getOwnPropertyDescriptor(givingPrototype, propertyName));
  });
}

/**
 * Utility class for function-related operations.
 *
 * @namespace ClassUtil
 */
var ClassUtil = {

  /**
   * <p>Debug Tool</p>
   * <p>Returns the name of the class of an instance</p>
   *
   * @param {object} instance An instance from which the class name will be fetched.
   * @returns {string} The name of the instance's class.
   */

  getName: function getName(instance) {
    if (instance == null) {
      return String(instance);
    }

    var name = void 0;
    if (typeof instance === 'function') {
      name = instance.name;
    } else {
      var proto = Object.getPrototypeOf(instance);
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
  merge: function merge(receivingClass) {
    if (typeof receivingClass !== 'function') {
      throw new Errors.SdkError(this, 'Receiving Class is not a function');
    }

    for (var _len = arguments.length, mixins = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      mixins[_key - 1] = arguments[_key];
    }

    for (var i = 0; i < mixins.length; i++) {
      var mixin = mixins[i];
      if (mixin == null) {
        throw new Errors.SdkError(this, 'Invalid mixin n° ' + i + ', not defined.');
      }

      if ((typeof mixin === 'undefined' ? 'undefined' : _typeof(mixin)) === 'object') {
        _mergeClass(receivingClass, mixin);
      } else if (typeof mixin === 'function') {
        _mergeClass(receivingClass, mixin.prototype);
      } else {
        throw new Errors.SdkError(this, 'Invalid type for mixin n° ' + i + ', only functions and objects are accepted as mixins.');
      }
    }

    return receivingClass;
  }
};

Object.freeze(ClassUtil);

exports.default = ClassUtil;