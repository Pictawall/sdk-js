'use strict';

const Model = require('ampersand-model');
const SyncPromise = require('ampersand-sync-with-promise');

const AssetCollection = require('../collections/AssetCollection');

const config = require('../services/Config');

/**
 * @class EventModel
 */
const EventModel = Model.extend({

  sync: SyncPromise,
  urlRoot() {
    return config.get('endpoint') + '/events';
  },

  idAttribute: 'identifier',
  props: {
    /**
     * Event identifier.
     *
     * @type {!string}
     * @memberOf EventModel
     * @instance
     * @readonly
     */
    identifier: {
      type: 'string',
      required: true,
      setOnce: true
    },

    // Fetched from the server
    /**
     * TODO unknown.
     *
     * @type {!string}
     * @memberOf EventModel
     * @instance
     * @readonly
     */
    name: {
      type: 'string',
      required: true,
      setOnce: true
    },

    /**
     * TODO unknown.
     *
     * @type {!string}
     * @memberOf EventModel
     * @instance
     * @readonly
     */
    ratio: {
      type: 'number',
      required: true,
      setOnce: true
    },

    /**
     * TODO unknown.
     *
     * @type {!boolean}
     * @memberOf EventModel
     * @instance
     * @readonly
     */
    showHashtag: {
      type: 'boolean',
      required: true,
      setOnce: true
    },

    /**
     * TODO unknown.
     *
     * @type {!boolean}
     * @memberOf EventModel
     * @instance
     * @readonly
     */
    showTopUsers: {
      type: 'boolean',
      required: true,
      setOnce: true
    },

    /**
     * Collections of assets related to this event.
     *
     * @type {!AssetCollection}
     * @memberOf EventModel
     * @instance
     * @readonly
     */
    assetCollection: {
      type: 'any',
      required: true,
      setOnce: true
    }
  },

  session: {
    /**
     * Whether or not the model should periodically update its collections.
     *
     * @type {!boolean}
     * @memberOf EventModel
     * @instance
     * @readonly
     */
    autoUpdate: {
      type: 'boolean',
      required: false,
      default: false
    },

    /**
     * Time in ms between two collection updates.
     *
     * @type {!number}
     * @memberOf EventModel
     * @instance
     * @readonly
     */
    autoUpdateVelocity: {
      type: 'number',
      required: false,
      default: 10000
    }
  },

  /**
   * <p>Creates a new Event model and its associated collections.</p>
   * <p>The data is automatically fetched from the server and an 'synchronised' event is dispatched once the data is loaded.</p>
   * <p>A 'synchronise-failed' event will be dispatched if the loading failed. The failure reason will be passed to the listeners.</p>
   * <p><strong>Note: Any parameter passed via the config object will also be passed to the event's collections' constructors. See their documentation for details on which parameter they may accept.</strong></p>
   * @constructs EventModel
   *
   * @classdesc <p>Model for pictawall events.</p>
   * <p>The model inherits from the [ampersand-model]{@link https://ampersandjs.com/docs/#ampersand-model} methods.</p>
   *
   * @param {!Object} config - The constructor parameters.
   * @param {!String} config.identifier - The pictawall event identifier.
   * @param {!boolean} [config.autoUpdate = false] - Should the collections periodically fetch their contents ?
   * @param {!number} [config.autoUpdateVelocity = 10000] - Time in ms between each auto-update.
   * @param {Object} assetParameters - The parameters to pass to the {@link AssetCollection} constructor.
   * @param autoUpdate
   */
  initialize({ identifier, autoUpdate = false, assetParameters = { eventIdentifier: identifier } } = {}) {
    if (!identifier) {
      throw new Error('Event identifier is not set');
    }

    this.set('assetCollection', new AssetCollection(null, assetParameters));

    Promise.all([
      this.fetch(),
      this.assetCollection.loadMore()
    ]).then(() => {
      this.trigger('synchronised');

      // TODO start autoupdate
    }).catch(e => {
      this.trigger('synchronise-failed', e);
    });
  },

  _autoUpdate() {
    if (!this.get('autoUpdate')) {
      return;
    }

    //let promises = [];

    //promises.push(this.getMediumCollection().updateCollection());
    //promises.push(this.getAdCollection().updateCollection());
    //promises.push(this.getMessageCollection().updateCollection());
    //promises.push(this.getUserCollection().updateCollection());

    //Promise.all(promises).then(() => {
    //  setTimeout(() => this._autoUpdate(), this.get('autoUpdateVelocity'));
    //});
  },

  stopAutoUpdate() {
    this.set('autoUpdate', false);
  },

  startAutoUpdate() {
    this.set('autoUpdate', true);
    this._autoUpdate();
  }
});

/**
 * Creates the event model and returns a promise that resolves once the model is synchronised with the API.
 *
 * @param {!Object} config - The config object to give to the {@link EventModel} constructor.
 * @returns {Promise.<EventModel>}
 */
EventModel.createAsync = function (config) {
  const event = new EventModel(config);

  return new Promise((resolve, reject) => {
    event.once('synchronised', () => resolve(event));
    event.once('synchronise-failed', e => reject(e));
  });
};

module.exports = EventModel;
