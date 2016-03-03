'use strict';

const Model = require('ampersand-model');

/**
 * @class CardModel
 */
const CardModel = Model.extend({

  idAttribute: 'id',

  props: {

    /**
     * Medium ID.
     *
     * @type {!number}
     * @memberOf AssetModel
     * @instance
     * @readonly
     */
    id: {
      type: 'number',
      required: true,
      setOnce: true
    },

    /**
     * Event to which this asset is attached.
     *
     * @type {!EventModel}
     * @memberOf AssetModel
     * @instance
     * @readonly
     */
    eventModel: {
      type: 'object',
      required: true,
      setOnce: true
    },

    /**
     * Asset type, eg. 'video', 'picture', ...
     *
     * @type {!String}
     * @memberOf AssetModel
     * @instance
     * @readonly
     */
    kind: {
      type: 'string',
      required: true,
      setOnce: true
    },

    /**
     * @typedef {Object} AssetImage
     * @property {String} thumbnail - URL to the thumbnail version of the image/video or null if no media is attached to this asset.
     * @property {String} default - URL to the regular version of the image/video if the asset type is 'picture' or 'video'.
     * @property {String} small - URL to the small version of the image if the type is an image and the format is available.
     * @property {String} medium - URL to the medium version of the image if the type is an image and the format is available.
     * @property {String} large - URL to the large version of the image if the type is an image and the format is available.
     */

    /**
     * Image or video associated with the medium.
     * Null if the asset type is nor 'video' nor 'picture'.
     *
     * @type {AssetImage}
     * @memberOf AssetModel
     * @instance
     * @readonly
     */
    media: {
      type: 'object',
      required: false,
      setOnce: true
    },

    /**
     * URL pointing to the original post on its original social network.
     *
     * @type {!string}
     * @memberOf AssetModel
     * @instance
     * @readonly
     */
    link: {
      type: 'string',
      required: true,
      setOnce: true
    },

    /**
     * Message attached to the asset.
     *
     * @type {!string}
     * @memberOf AssetModel
     * @instance
     * @readonly
     */
    message: {
      type: 'string',
      required: true,
      setOnce: true
    }
  }
});

module.exports = CardModel;
