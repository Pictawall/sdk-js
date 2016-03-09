'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ClassUtil = require('../../../src/util/ClassUtil');
var Errors = require('../../../src/core/Errors.js');

describe('ClassUtil', function () {

  describe('#getName', function () {
    var anonymousResponse = 'nameless';
    function JohnFunction() {}

    it('returns the name of the primitive if the parameter is a primitive value', function () {
      expect(ClassUtil.getName(null)).toBe('null');
      expect(ClassUtil.getName(void 0)).toBe('undefined');
      expect(ClassUtil.getName(true)).toBe('Boolean');
      expect(ClassUtil.getName(1)).toBe('Number');
      expect(ClassUtil.getName('hello')).toBe('String');
      expect(ClassUtil.getName({})).toBe('Object');
      expect(ClassUtil.getName([])).toBe('Array');
    });

    it('returns the name of the function if the parameter is a function', function () {
      expect(ClassUtil.getName(JohnFunction)).toBe('JohnFunction');
    });

    it('returns the name of the class if the parameter is an instance', function () {
      var instance = new JohnFunction();

      expect(ClassUtil.getName(instance)).toBe('JohnFunction');
    });

    it('returns "' + anonymousResponse + '" if the function isn\'t named', function () {
      expect(ClassUtil.getName(function () {})).toBe(anonymousResponse);
    });

    it('returns "' + anonymousResponse + '" if the instance is of a nameless function', function () {
      expect(ClassUtil.getName(new function () {}())).toBe(anonymousResponse);
    });
  });

  describe('#merge', function () {

    it('throws if the arguments are invalid', function () {
      expect(function () {
        return ClassUtil.merge(null, {});
      }).toThrow();
      expect(function () {
        return ClassUtil.merge(function () {}, null);
      }).toThrow();
      expect(function () {
        return ClassUtil.merge(function () {}, 124);
      }).toThrow();
    });

    it('throws if the merge overwrites an existing property', function () {
      var Receiver = function () {
        function Receiver() {
          _classCallCheck(this, Receiver);
        }

        _createClass(Receiver, [{
          key: 'sayHi',
          value: function sayHi() {}
        }]);

        return Receiver;
      }();

      expect(function () {
        return ClassUtil.merge(Receiver, {
          sayHi: function sayHi() {}
        });
      }).toThrow();
    });

    describe('Class merge', function () {
      var MixinClass = function () {
        function MixinClass() {
          _classCallCheck(this, MixinClass);
        }

        _createClass(MixinClass, [{
          key: 'instanceMethodA',
          value: function instanceMethodA() {
            return 'IAMA'; // not a reddit reference.
          }
        }], [{
          key: 'staticMethodA',
          value: function staticMethodA() {
            return 'I_SHOULD_NOT_EXIST';
          }
        }]);

        return MixinClass;
      }();

      var Receiver = function () {
        function Receiver() {
          _classCallCheck(this, Receiver);
        }

        _createClass(Receiver, [{
          key: 'instanceMethodX',
          value: function instanceMethodX() {
            return 'IAMX'; // this one is a reference though.
          }
        }]);

        return Receiver;
      }();

      var receiverOriginalConstructor = Receiver.prototype.constructor;

      it('mixes in class prototypes', function () {
        ClassUtil.merge(Receiver, MixinClass);

        var receiver = new Receiver();
        expect(receiver.instanceMethodX()).toBe('IAMX');
        expect(receiver.instanceMethodA()).toBe('IAMA');
      });

      it('does not add static properties', function () {
        expect(Receiver.staticMethodA).toBeUndefined();
      });

      it('does not override the constructor', function () {
        expect(Receiver.prototype.constructor).toBe(receiverOriginalConstructor);
      });
    });

    describe('Object merge', function () {

      var MixinObject = {
        constructor: function constructor() {},
        instanceMethodB: function instanceMethodB() {
          return 'IAMB';
        }
      };

      var Receiver = function () {
        function Receiver() {
          _classCallCheck(this, Receiver);
        }

        _createClass(Receiver, [{
          key: 'instanceMethodZ',
          value: function instanceMethodZ() {
            return 'IAMZ'; // this one is a reference though.
          }
        }]);

        return Receiver;
      }();

      var receiverOriginalConstructor = Receiver.prototype.constructor;

      it('mixes objects in the receiving prototype', function () {
        ClassUtil.merge(Receiver, MixinObject);

        var receiver = new Receiver();
        expect(receiver.instanceMethodZ()).toBe('IAMZ');
        expect(receiver.instanceMethodB()).toBe('IAMB');
      });

      it('does not override the constructor', function () {
        expect(Receiver.prototype.constructor).toBe(receiverOriginalConstructor);
      });
    });
  });
});