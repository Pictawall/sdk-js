'use strict';

/**
 * @example
 * Collection.extend({
 *  fetch: require('./ampersand-rest-collection-promise').fetch
 * });
 *
 * @type AmpersandSync
 */
module.exports = require('./_ampersand-promise')(require('ampersand-collection-rest-mixin'));
