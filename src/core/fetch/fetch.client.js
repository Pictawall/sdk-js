const loader = new Promise(resolve => {
  if (window.fetch) {
    return resolve();
  }

  if (typeof require.ensure !== 'function') {
    require.ensure = (ignored, callback) => callback(require);
  }

  require.ensure(['whatwg-fetch'], require => {
    require('whatwg-fetch');
    resolve();
  }, 'fetch-polyfill-client');
});

export default {
  load() {
    return loader.then(() => {
      if (!this.fetch) {
        this.fetch = window.fetch();
      }

      if (!this.Response) {
        this.Response = window.Response;
      }
    });
  },

  set Promise(implementation) {}
};
