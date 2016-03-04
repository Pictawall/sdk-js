(function() {
  'use strict';

  class A {

    getCheeze() {
      A.getB();
    }

    static getB() {
      console.log('b');
    }
  }

  class B extends A {
    static getB() {
      console.log('c');
    }
  }

  (new A()).getCheeze();
})();
