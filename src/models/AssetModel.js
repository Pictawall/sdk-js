'use strict';

const CardModel = require('./CardModel');

// TODO optional dep
//const moment = require('moment');

/**
 * @classdesc <p>Model for pictawall events' assets.</p>
 * <p>The model inherits from the [ampersand-model]{@link https://ampersandjs.com/docs/#ampersand-model} methods.</p>
 *
 * @class AssetModel
 * @inherits {CardModel}
 */
const AssetModel = CardModel.extend({

  props: {

    /**
     * Count of times the asset was displayed
     *
     * @type {!number}
     * @memberOf AssetModel
     * @instance
     * @readonly
     */
    displayCount: {
      type: 'number',
      required: true,
      setOnce: true
    },

    /*
     "event": "batibouw-2016", // unused
     */

    /**
     * @typedef {Object} AssetSource
     * @property {!String} network - Source type, eg. 'twitter'
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
     * Asset like count.
     *
     * @type {!number}
     * @memberOf AssetModel
     * @instance
     * @readonly
     */
    likeCount: {
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
    commentCount: {
      type: 'number',
      required: true,
      setOnce: true
    },

    /**
     * Whether or not the event manager favorited this asset.
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
     * Whether or not the event manager featured this asset.
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
     * @typedef {Object} AssetOwner
     * @property {!String} id - The id of the asset owner as used by the original source.
     * @property {!String} author - The display name of the asset owner.
     * @property {!String} username - The account name of the asset owner.
     * @property {!String} avatar - URL poiting to the avatar of the asset owner.
     */

    /**
     * Author of the asset.
     *
     * @type {!AssetOwner}
     * @memberOf AssetModel
     * @instance
     * @readonly
     */
    owner: {
      type: 'object',
      required: true,
      setOnce: true
    },

    /**
     * Author of the asset.
     *
     * @type {!AssetOwner}
     * @memberOf AssetModel
     * @instance
     * @readonly
     */
    safe: {
      type: 'boolean',
      required: true,
      setOnce: true
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
    // PATCH assets/id/check/user
  },

  /**
   * Call this method if the media.default url points to a dead link.
   *
   * @memberOf AssetModel
   * @instance
   */
  markMediaAdDead() {
    // TODO NYI
    // PATCH assets/id/check/
  },

  /**
   * Report the asset for moderation.
   *
   * @memberOf AssetModel
   * @instance
   */
  report() {
    if (this.isSafe) {
      return;
    }

    // TODO NYI
    // PATCH assets/id/report
  }
});

module.exports = AssetModel;
