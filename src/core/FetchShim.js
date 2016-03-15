// Node compatibility module
'use strict';

const FetchShim = {

  /**
   * Loads the right fetch polyfill
   *
   * @returns {Promise}
   */
  loadFetchPolyfill() {
    if (this.fetch && this.Response) {
      return Promise.resolve(this.fetch);
    }

    if (!this.fetchDownloader) {
      throw new Error('Fetch Downloader not defined');
    }

    return new Promise(resolve => {
      this.fetchDownloader(function ({ fetch, Response }) {
        this.fetch = fetch;
        this.Response = Response;

        resolve(fetch);
      });
    });
  }
};

export default FetchShim;
