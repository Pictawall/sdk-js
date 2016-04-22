'use strict';

import FetchShim from './FetchShim';

if (typeof require.ensure !== 'function') {
  require.ensure = function (dependencies, callback) {
    callback(require);
  };
}

let loadingPromise = null;

export default function () {
  // only call this clusterfuck once.
  if (loadingPromise) {
    return loadingPromise;
  }

  try {
    const polyfillPromises = [];

    // global.fetch
    polyfillPromises.push(FetchShim.loadFetchPolyfill());

    // Symbol
    if (typeof Symbol === 'undefined') {
      polyfillPromises.push(new Promise(resolve => {
        require.ensure(['es6-symbol/implement', 'es5-ext/array/#/@@iterator/implement'], require => {
          resolve([require('es6-symbol/implement'), require('es5-ext/array/#/@@iterator/implement')]);
        }, 'Symbol-polyfill');
      }));
    }

    // Map
    const mapPromise = new Promise(resolve => {
      if (require('es6-map/is-implemented')()) {
        return resolve();
      }

      require.ensure(['es6-map/implement'], require => {
        require('es6-map/implement');
        resolve();
      }, 'Map-polyfill');
    });

    polyfillPromises.push(mapPromise);

    // Map.toJSON
    polyfillPromises.push(mapPromise.then(() => new Promise(resolve => {
      if (Map.prototype.toJSON) {
        return resolve();
      }

      require.ensure(['map.prototype.tojson'], require => {
        resolve(require('map.prototype.tojson'));
      }, 'Map.toJson-polyfill');
    })));

    // Array.includes
    if (!Array.prototype.includes) {
      polyfillPromises.push(new Promise(resolve => {
        require.ensure(['array-includes'], require => {
          require('array-includes').shim();

          resolve();
        }, 'Array.includes-polyfill');
      }));
    }

    // Array.findIndex
    if (!Array.prototype.findIndex) {
      polyfillPromises.push(new Promise(resolve => {
        require.ensure(['es5-ext/array/#/find-index/implement'], require => {
          resolve(require('es5-ext/array/#/find-index/implement'));
        }, 'Array.prototype.findIndex-polyfill');
      }));
    }

    // Array.from
    if (!Array.from) {
      polyfillPromises.push(new Promise(resolve => {
        require.ensure(['es5-ext/array/from/implement'], require => {
          resolve(require('es5-ext/array/from/implement'));
        }, 'Array.from-polyfill');
      }));
    }

    // String.endsWith
    if (!String.prototype.endsWith) {
      polyfillPromises.push(new Promise(resolve => {
        require.ensure(['es5-ext/string/#/ends-with/implement'], require => {
          resolve(require('es5-ext/string/#/ends-with/implement'));
        }, 'String.endsWith-polyfill');
      }));
    }

    // Object.is
    if (!Object.is) {
      polyfillPromises.push(new Promise(resolve => {
        require.ensure(['object-is'], require => {
          Object.is = require('object-is');

          resolve();
        }, 'String.endsWith-polyfill');
      }));
    }

    // WeakMap
    if (typeof WeakMap !== 'function') {
      polyfillPromises.push(new Promise(resolve => {
        require.ensure(['es6-weak-map/implement'], require => {
          require('es6-weak-map/implement');

          resolve();
        }, 'WeakMap-polyfill');
      }));
    }

    loadingPromise = Promise.all(polyfillPromises).then(() => {}); // resolve nothing
    return loadingPromise;
  } catch (e) {
    return Promise.reject(e);
  }
}
