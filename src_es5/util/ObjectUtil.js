'use strict';

module.exports = {
  find: function find(container, scriptName) {
    // window, document.head
    var names = scriptName.split('.'); // [document, head]

    for (var i = 0; i < names.length; i++) {
      if (container === void 0) {
        return void 0;
      }

      container = container[names[i]];
    }

    return container;
  },
  exists: function exists(container, scriptName) {
    return this.find(container, scriptName) !== void 0;
  }
};