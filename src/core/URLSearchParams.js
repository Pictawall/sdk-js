import Sdk from './Sdk';
import global from './global';

export default {
  load() {
    if (typeof global.URLSearchParams === 'function') {
      this.URLSearchParams = global.URLSearchParams;
      return Sdk.Promise.resolve();
    }

    return new Sdk.Promise(resolve => {
      if (typeof require.ensure !== 'function') {
        require.ensure = function (dependencies, callback) {
          callback(require);
        };
      }

      require.ensure(['url-search-params'], require => {
        this.URLSearchParams = require('url-search-params');
        resolve();
      }, 'QueryStringShim-polyfill');
    });
  }
};
