'use strict';

const model = require('ampersand-model');

/**
 * @example
 * Model.extend({
 *  fetch: require('./ampersand-model-promise').fetch
 * });
 *
 * @type AmpersandSync
 */
module.exports = require('./_ampersand-promise')(model.prototype);
