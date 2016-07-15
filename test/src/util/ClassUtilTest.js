'use strict';

import ClassUtil from '../../../src/util/ClassUtil';

describe('ClassUtil', () => {

  describe('#getName', () => {
    const anonymousResponse = 'nameless';
    function JohnFunction() {}

    it(`returns the name of the primitive if the parameter is a primitive value`, () => {
      expect(ClassUtil.getName(null)).toBe('null');
      expect(ClassUtil.getName(void 0)).toBe('undefined');
      expect(ClassUtil.getName(true)).toBe('Boolean');
      expect(ClassUtil.getName(1)).toBe('Number');
      expect(ClassUtil.getName('hello')).toBe('String');
      expect(ClassUtil.getName({})).toBe('Object');
      expect(ClassUtil.getName([])).toBe('Array');
    });

    it('returns the name of the function if the parameter is a function', () => {
      expect(ClassUtil.getName(JohnFunction)).toBe('JohnFunction');
    });

    it('returns the name of the class if the parameter is an instance', () => {
      const instance = new JohnFunction();

      expect(ClassUtil.getName(instance)).toBe('JohnFunction');
    });

    it(`returns "${anonymousResponse}" if the function isn't named`, () => {
      expect(ClassUtil.getName(function () {})).toBe(anonymousResponse);
    });

    it(`returns "${anonymousResponse}" if the instance is of a nameless function`, () => {
      expect(ClassUtil.getName(new (function () {}))).toBe(anonymousResponse);
    });
  });

  describe('#merge', () => {

    it('throws if the arguments are invalid', () => {
      expect(() => ClassUtil.merge(null, {})).toThrow();
      expect(() => ClassUtil.merge(function () {}, null)).toThrow();
      expect(() => ClassUtil.merge(function () {}, 124)).toThrow();
    });

    it('throws if the merge overwrites an existing property', () => {
      class Receiver {
        sayHi() {}
      }

      expect(() => ClassUtil.merge(Receiver, { sayHi() {} })).toThrow();
    });

    const aSymbol = Symbol('aSymbol');

    describe('Class merge', () => {

      class MixinClass {
        constructor() {}

        instanceMethodA() {
          return 'IAMA'; // not a reddit reference.
        }

        get john() {
          return 'hi';
        }

        [aSymbol]() {
          return 'Symbol reporting for duty ?';
        }

        static staticMethodA() {
          return 'I_SHOULD_NOT_EXIST';
        }
      }

      class Receiver {
        constructor() {}

        instanceMethodX() {
          return 'IAMX'; // this one is a reference though.
        }
      }

      const receiverOriginalConstructor = Receiver.prototype.constructor;

      it('mixes in class prototypes', () => {
        ClassUtil.merge(Receiver, MixinClass);

        const receiver = new Receiver();
        expect(receiver.instanceMethodX()).toBe('IAMX');
        expect(receiver.instanceMethodA()).toBe('IAMA');
        expect(receiver[aSymbol]()).toBe('Symbol reporting for duty ?');
        expect(receiver.john).toBe('hi');
      });

      it('does not add static properties', () => {
        expect(Receiver.staticMethodA).toBeUndefined();
      });

      it('does not override the constructor', () => {
        expect(Receiver.prototype.constructor).toBe(receiverOriginalConstructor);
      });
    });

    describe('Object merge', () => {

      const MixinObject = {
        constructor() {},

        get john() {
          return 'hi';
        },

        instanceMethodB() {
          return 'IAMB';
        },

        [aSymbol]() {
          return 'Symbol reporting for duty ?';
        }
      };

      class Receiver {
        constructor() {
        }

        instanceMethodZ() {
          return 'IAMZ'; // this one is a reference though.
        }
      }

      const receiverOriginalConstructor = Receiver.prototype.constructor;

      it('mixes objects in the receiving prototype', () => {
        ClassUtil.merge(Receiver, MixinObject);

        const receiver = new Receiver();
        expect(receiver.instanceMethodZ()).toBe('IAMZ');
        expect(receiver.instanceMethodB()).toBe('IAMB');
        expect(receiver[aSymbol]()).toBe('Symbol reporting for duty ?');
        expect(receiver.john).toBe('hi');
      });

      it('does not override the constructor', () => {
        expect(Receiver.prototype.constructor).toBe(receiverOriginalConstructor);
      });
    });
  });
});
