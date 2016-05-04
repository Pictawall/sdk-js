'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  // only call this clusterfuck once.
  if (loadingPromise) {
    return loadingPromise;
  }

  try {
    var polyfillPromises = [];

    // global.fetch
    polyfillPromises.push(_FetchShim2.default.loadFetchPolyfill());

    // Symbol
    if (typeof Symbol === 'undefined') {
      polyfillPromises.push(new Promise(function (resolve) {
        require.ensure(['es6-symbol/implement', 'es5-ext/array/#/@@iterator/implement'], function (require) {
          resolve([require('es6-symbol/implement'), require('es5-ext/array/#/@@iterator/implement')]);
        }, 'Symbol-polyfill');
      }));
    }

    // Map
    var mapPromise = new Promise(function (resolve) {
      if (require('es6-map/is-implemented')()) {
        return resolve();
      }

      require.ensure(['es6-map/implement'], function (require) {
        require('es6-map/implement');
        resolve();
      }, 'Map-polyfill');
    });

    polyfillPromises.push(mapPromise);

    // Map.toJSON
    polyfillPromises.push(mapPromise.then(function () {
      return new Promise(function (resolve) {
        if (Map.prototype.toJSON) {
          return resolve();
        }

        require.ensure(['map.prototype.tojson'], function (require) {
          resolve(require('map.prototype.tojson'));
        }, 'Map.toJson-polyfill');
      });
    }));

    // Array.includes
    if (!Array.prototype.includes) {
      polyfillPromises.push(new Promise(function (resolve) {
        require.ensure(['array-includes'], function (require) {
          require('array-includes').shim();

          resolve();
        }, 'Array.includes-polyfill');
      }));
    }

    // Array.findIndex
    if (!Array.prototype.findIndex) {
      polyfillPromises.push(new Promise(function (resolve) {
        require.ensure(['es5-ext/array/#/find-index/implement'], function (require) {
          resolve(require('es5-ext/array/#/find-index/implement'));
        }, 'Array.prototype.findIndex-polyfill');
      }));
    }

    // Array.from
    if (!Array.from) {
      polyfillPromises.push(new Promise(function (resolve) {
        require.ensure(['es5-ext/array/from/implement'], function (require) {
          resolve(require('es5-ext/array/from/implement'));
        }, 'Array.from-polyfill');
      }));
    }

    // String.endsWith
    if (!String.prototype.endsWith) {
      polyfillPromises.push(new Promise(function (resolve) {
        require.ensure(['es5-ext/string/#/ends-with/implement'], function (require) {
          resolve(require('es5-ext/string/#/ends-with/implement'));
        }, 'String.endsWith-polyfill');
      }));
    }

    // Object.is
    if (!Object.is) {
      polyfillPromises.push(new Promise(function (resolve) {
        require.ensure(['object-is'], function (require) {
          Object.is = require('object-is');

          resolve();
        }, 'String.endsWith-polyfill');
      }));
    }

    // WeakMap
    if (typeof WeakMap !== 'function') {
      polyfillPromises.push(new Promise(function (resolve) {
        require.ensure(['es6-weak-map/implement'], function (require) {
          require('es6-weak-map/implement');

          resolve();
        }, 'WeakMap-polyfill');
      }));
    }

    loadingPromise = Promise.all(polyfillPromises).then(function () {}); // resolve nothing
    return loadingPromise;
  } catch (e) {
    return Promise.reject(e);
  }
};

var _FetchShim = require('./FetchShim');

var _FetchShim2 = _interopRequireDefault(_FetchShim);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (typeof require.ensure !== 'function') {
  require.ensure = function (dependencies, callback) {
    callback(require);
  };
}

var loadingPromise = null;