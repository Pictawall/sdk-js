'use strict';

/**
 * @example
 * Collection.extend({
 *  sync: require('ampersand-sync-promise').sync
 * });
 *
 * @type AmpersandSync
 */
module.exports = require('./_ampersand-promise')(require('ampersand-collection-rest-mixin'));
