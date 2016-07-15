'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ClassUtil = require('../../../src/util/ClassUtil');

var _ClassUtil2 = _interopRequireDefault(_ClassUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

describe('ClassUtil', function () {

  describe('#getName', function () {
    var anonymousResponse = 'nameless';
    function JohnFunction() {}

    it('returns the name of the primitive if the parameter is a primitive value', function () {
      expect(_ClassUtil2.default.getName(null)).toBe('null');
      expect(_ClassUtil2.default.getName(void 0)).toBe('undefined');
      expect(_ClassUtil2.default.getName(true)).toBe('Boolean');
      expect(_ClassUtil2.default.getName(1)).toBe('Number');
      expect(_ClassUtil2.default.getName('hello')).toBe('String');
      expect(_ClassUtil2.default.getName({})).toBe('Object');
      expect(_ClassUtil2.default.getName([])).toBe('Array');
    });

    it('returns the name of the function if the parameter is a function', function () {
      expect(_ClassUtil2.default.getName(JohnFunction)).toBe('JohnFunction');
    });

    it('returns the name of the class if the parameter is an instance', function () {
      var instance = new JohnFunction();

      expect(_ClassUtil2.default.getName(instance)).toBe('JohnFunction');
    });

    it('returns "' + anonymousResponse + '" if the function isn\'t named', function () {
      expect(_ClassUtil2.default.getName(function () {})).toBe(anonymousResponse);
    });

    it('returns "' + anonymousResponse + '" if the instance is of a nameless function', function () {
      expect(_ClassUtil2.default.getName(new function () {}())).toBe(anonymousResponse);
    });
  });

  describe('#merge', function () {

    it('throws if the arguments are invalid', function () {
      expect(function () {
        return _ClassUtil2.default.merge(null, {});
      }).toThrow();
      expect(function () {
        return _ClassUtil2.default.merge(function () {}, null);
      }).toThrow();
      expect(function () {
        return _ClassUtil2.default.merge(function () {}, 124);
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
        return _ClassUtil2.default.merge(Receiver, {
          sayHi: function sayHi() {}
        });
      }).toThrow();
    });

    var aSymbol = Symbol('aSymbol');

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
        }, {
          key: aSymbol,
          value: function value() {
            return 'Symbol reporting for duty ?';
          }
        }, {
          key: 'john',
          get: function get() {
            return 'hi';
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
        _ClassUtil2.default.merge(Receiver, MixinClass);

        var receiver = new Receiver();
        expect(receiver.instanceMethodX()).toBe('IAMX');
        expect(receiver.instanceMethodA()).toBe('IAMA');
        expect(receiver[aSymbol]()).toBe('Symbol reporting for duty ?');
        expect(receiver.john).toBe('hi');
      });

      it('does not add static properties', function () {
        expect(Receiver.staticMethodA).toBeUndefined();
      });

      it('does not override the constructor', function () {
        expect(Receiver.prototype.constructor).toBe(receiverOriginalConstructor);
      });
    });

    describe('Object merge', function () {

      var MixinObject = _defineProperty({
        constructor: function constructor() {},


        get john() {
          return 'hi';
        },

        instanceMethodB: function instanceMethodB() {
          return 'IAMB';
        }
      }, aSymbol, function () {
        return 'Symbol reporting for duty ?';
      });

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
        _ClassUtil2.default.merge(Receiver, MixinObject);

        var receiver = new Receiver();
        expect(receiver.instanceMethodZ()).toBe('IAMZ');
        expect(receiver.instanceMethodB()).toBe('IAMB');
        expect(receiver[aSymbol]()).toBe('Symbol reporting for duty ?');
        expect(receiver.john).toBe('hi');
      });

      it('does not override the constructor', function () {
        expect(Receiver.prototype.constructor).toBe(receiverOriginalConstructor);
      });
    });
  });
});