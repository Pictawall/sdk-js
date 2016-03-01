'use strict';

const Model = require('ampersand-model');
const SyncPromise = require('ampersand-sync-with-promise');
const moment = require('moment');

const config = require('../services/Config');

/**
 * @classdesc <p>Model for pictawall events' assets.</p>
 * <p>The model inherits from the [ampersand-model]{@link https://ampersandjs.com/docs/#ampersand-model} methods.</p>
 *
 * @class AssetModel
 */
const AssetModel = Model.extend({
  sync: SyncPromise,

  /**
   * @ignore
   */
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
     * TODO unknown
     *
     * @type {!number}
     * @memberOf AssetModel
     * @instance
     * @readonly
     */
    channel: {
      type: 'number',
      required: true,
      setOnce: true
    },

    /*
     "event": "batibouw-2016",
     */
    /**
     * Event to which this asset is attached.
     *
     * @type {!EventModel}
     * @memberOf AssetModel
     * @instance
     * @readonly
     */
    eventModel: { // set to the value of the parent event model
      type: 'object',
      required: true,
      setOnce: true
    },

    /**
     * @typedef {Object} AssetSource
     * @property {!String} type - Source type, eg. 'twitter'
     * @property {!String} id - Asset source id as used by the source itself.
     * @property {Object} additionalData - source-specific data.
     */

    /**
     * Asset original source.
     *
     * @type {!AssetSource}
     * @memberOf AssetModel
     * @instance
     * @readonly
     */
    source: {
      type: 'object',
      required: true,
      setOnce: true
    },

    /**
     * Asset type, eg. 'video', 'image', ...
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
     * @property {String} default - URL to the regular version of the image/video if the asset type is 'image' or 'video'.
     * @property {String} small - URL to the small version of the image if the type is an image and the format is available.
     * @property {String} medium - URL to the medium version of the image if the type is an image and the format is available.
     * @property {String} large - URL to the large version of the image if the type is an image and the format is available.
     */

    /**
     * Image or video associated with the medium.
     *
     * @type {!AssetImage}
     * @memberOf AssetModel
     * @instance
     * @readonly
     */
    media: {
      type: 'object',
      required: true
    },

    /**
     * Timestamp in seconds at which the asset was originally posted.
     *
     * @type {!number}
     * @memberOf AssetModel
     * @instance
     * @readonly
     */
    postTime: {
      type: 'number',
      required: true,
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
    },

    /**
     * Asset like count.
     *
     * @type {!number}
     * @memberOf AssetModel
     * @instance
     * @readonly
     */
    likes: {
      type: 'number',
      required: true,
      setOnce: true
    },

    /**
     * Asset comment count.
     *
     * @type {!number}
     * @memberOf AssetModel
     * @instance
     * @readonly
     */
    comments: {
      type: 'number',
      required: true,
      setOnce: true
    },

    /**
     * TODO unknown
     *
     * @type {!boolean}
     * @memberOf AssetModel
     * @instance
     * @readonly
     */
    favorited: {
      type: 'boolean',
      required: true,
      setOnce: true
    },

    /**
     * TODO unknown
     *
     * @type {!boolean}
     * @memberOf AssetModel
     * @instance
     * @readonly
     */
    featured: {
      type: 'boolean',
      required: true,
      setOnce: true
    },

    /**
     * TODO unknown
     *
     * @type {!boolean}
     * @memberOf AssetModel
     * @instance
     * @readonly
     */
    effect: {
      type: 'boolean',
      required: true,
      setOnce: true
    },

    /**
     * TODO unknown
     *
     * @type {!boolean}
     * @memberOf AssetModel
     * @instance
     * @readonly
     */
    caption: {
      type: 'boolean',
      required: true,
      setOnce: true
    },

    /**
     * @typedef {Object} AssetImage
     * @property {String} thumbnail - URL to the thumbnail version of the image/video or null if no media is attached to this asset.
     * @property {String} default - URL to the regular version of the image/video if the asset type is 'image' or 'video'.
     * @property {String} small - URL to the small version of the image if the type is an image and the format is available.
     * @property {String} medium - URL to the medium version of the image if the type is an image and the format is available.
     * @property {String} large - URL to the large version of the image if the type is an image and the format is available.
     */

    /**
     * TODO unknown
     *
     * @type {!boolean}
     * @memberOf AssetModel
     * @instance
     * @readonly
     */
    owner: {
      type: 'object',
      required: true,
      setOnce: true
    }
  },

  derived: {

    /**
     * MomentJS string representing the time at which the asset was created.
     *
     * @type {!string}
     * @memberOf AssetModel
     * @instance
     * @readonly
     */
    since: {
      deps: ['postTime'],

      fn: function () {
        return moment.unix(this.postTime).fromNow();
      }
    }
  },

  /**
   * Call this method if the owner.avatar url points to a dead link.
   *
   * @memberOf AssetModel
   * @instance
   */
  markAvatarAsDead() {
    // TODO NYI
  },

  /**
   * Call this method if the media.default url points to a dead link.
   *
   * @memberOf AssetModel
   * @instance
   */
  markMediaAdDead() {
    // TODO NYI
  }
});

module.exports = AssetModel;
