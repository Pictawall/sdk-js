'use strict';

require('jasmine-ajax');
const config = require('../src/services/Config');
const StringUtil = require('./StringUtil');

function mockRequest(path, pathParams, response) {
  jasmine.Ajax.stubRequest(new RegExp(config.get('endpoint') + StringUtil.format(path, pathParams) + '.*')).andReturn(response);
}

module.exports = {
  init() {
    jasmine.Ajax.install();

    // VALID ROUTES
    mockRequest('/events/{0}', [this.VALID_IDENTIFIER], {
      status: 200,
      responseText: JSON.stringify(this.VALID_EVENT)
    });

    mockRequest('/events/{0}/assets', [this.VALID_IDENTIFIER], {
      status: 200,
      responseText: JSON.stringify(this.VALID_EVENT_ASSETS)
    });

    // INVALID ROUTES
    mockRequest('/events/{0}', [this.INVALID_IDENTIFIER], {
      status: 404
    });

    mockRequest('/events/{0}/assets', [this.INVALID_IDENTIFIER], {
      status: 404
    });
  },

  destroy() {
    jasmine.Ajax.uninstall();
  },

  VALID_IDENTIFIER: 'VALID',
  INVALID_IDENTIFIER: 'INVALID',

  VALID_EVENT: {
    name: 'Batibouw 2016',
    identifier: 'VALID',
    ratio: 12,
    showHashtag: false,
    showTopUsers: false
  },

  VALID_EVENT_ASSETS: {
    since: 1456846964,
    total: 2,
    page: 1,
    pages: 1,
    data: [{
      id: 2690230,
      displayCount: 10,
      event: 'batibouw-2016',
      source: {
        type: 'twitter',
        id: '704679805946617856'
      },
      kind: 'picture',
      media: {
        thumbnail: 'http://pbs.twimg.com/media/CceGjL9WwAIY2p5.jpg:thumb',
        default: 'http://pbs.twimg.com/media/CceGjL9WwAIY2p5.jpg:large',
        small: null,
        medium: null,
        large: null
      },
      link: 'https://twitter.com/giacodacy/status/704679805946617856',
      message: '#giacowall https://t.co/760aCSvq7w',
      postTime: 1456843732,
      likeCount: 0,
      commentCount: 0,
      favorited: false,
      featured: false,
      owner: {
        author: 'Bruno Dacy',
        username: 'giacodacy',
        avatar: 'https://pbs.twimg.com/profile_images/702815005012574209/oFS4LfR6.jpg'
      }
    }, {
      id: 2689820,
      displayCount: 54,
      event: 'batibouw-2016',
      source: {
        type: 'twitter',
        id: '704632461490257921'
      },
      kind: 'picture',
      media: {
        thumbnail: 'http://pbs.twimg.com/media/Ccdben5WwAAdApK.jpg:thumb',
        default: 'http://pbs.twimg.com/media/Ccdben5WwAAdApK.jpg:large',
        small: null,
        medium: null,
        large: null
      },
      link: 'https://twitter.com/Giacowim/status/704632461490257921',
      message: '#giacowall @GiacoBNL harde werkers, die Walen! https://t.co/4pT3YcXh1r',
      caption: true,
      postTime: 1456832444,
      likeCount: 0,
      commentCount: 0,
      favorited: false,
      featured: false,
      owner: {
        author: 'Wim Gijbels',
        username: 'Giacowim',
        avatar: 'https://pbs.twimg.com/profile_images/687284174768713728/4-AfMX9h.jpg'
      }
    }]
  }
};
