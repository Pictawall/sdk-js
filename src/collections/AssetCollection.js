'use strict';

const PagedCollection = require('./PagedCollection');
const AssetModel = require('../models/AssetModel');

class AssetCollection extends PagedCollection {

  /**
   * @param {EventModel} event The owning event.
   * @param {number} [limit = 100] How many assets should be returned by each api call.
   */
  constructor(event, limit = 100, filter = { orderBy: 'date_desc', kind: null }) {
    super(AssetModel, {
      eventId: event.getProperty('identifier')
    }, limit);

    this._event = event;
    this.setApiPath(`/events/${event.getProperty('identifier')}/assets/{assetId}`);
  }

  updateAll() {
    // TODO
  }

  /**
   * Returns the featured tweet if any is available, null otherwise.
   * @returns {UserModel}
   */
  getFeaturedAsset() {
    const assetId = this._event.getProperty('featuredAssetId');

    if (assetId === -1) {
      return null;
    }

    // TODO get event id from collection or fetch it by id
  }

  /**
   * <p>Returns the list of assets the content manager favorited.</p>
   * <p>Note: This method only filters out non-favorited assets. It does not guarantee to return every favorited
   * asset unless {@link PagedCollection#hasMore} returns false.</p>
   *
   * @returns {Array.<UserModel>}
   */
  getFavorites() {
    return this.find({ favorited: true }).toArray();
  }

  /**
   * Options sent with fetch requests as query parameters.
   *
   * @readonly
   */
  get fetchOptions() {
    return super.fetchOptions;

    // TODO: add options: order_by, and kind
  }

  /**
   * Parses the response from the server and returns the data to use for model creation.
   *
   * @override
   */
  parse(data) {
    data = super.parse(data);

    return data.data;
  }

  /**
   * Creates a model and sets its properties.
   *
   * @param {!object} modelData The properties of the model.
   */
  createModel(modelData) {
    const model = new AssetModel(this._event);

    model._setProperties(modelData);

    return model;
  }
}

module.exports = AssetCollection;
