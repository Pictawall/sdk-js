'use strict';

module.exports = {
  find(container, scriptName) { // window, document.head
    const names = scriptName.split('.'); // [document, head]

    for (let i = 0; i < names.length; i++) {
      if (container === void 0) {
        return void 0;
      }

      container = container[names[i]];
    }

    return container;
  },

  exists(container, scriptName) {
    return this.find(container, scriptName) !== void 0;
  }
};
