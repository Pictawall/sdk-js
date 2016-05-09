import fetch, { Response } from 'node-fetch';

export default {
  load() {},

  fetch,
  Response,

  set Promise(implementation) {
    if (fetch.Promise === global.Promise) {
      fetch.Promise = implementation;
    }
  }
};
