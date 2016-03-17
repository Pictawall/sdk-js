// Node compatibility module
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var FetchShim = {

  /**
   * Loads the right fetch polyfill
   *
   * @returns {Promise}
   */

  loadFetchPolyfill: function loadFetchPolyfill() {
    var _this = this;

    if (this.fetch && this.Response) {
      return Promise.resolve(this.fetch);
    }

    if (!this.fetchDownloader) {
      throw new Error('Fetch Downloader not defined');
    }

    return new Promise(function (resolve) {
      _this.fetchDownloader(function (_ref) {
        var fetch = _ref.fetch;
        var Response = _ref.Response;

        _this.fetch = fetch;
        _this.Response = Response;

        resolve(fetch);
      });
    });
  }
};

exports.default = FetchShim;