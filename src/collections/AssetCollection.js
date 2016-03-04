'use strict';

const PagedCollection = require('./PagedCollection');
const AssetModel = require('../models/AssetModel');

class AssetCollection extends PagedCollection {

  /**
   * @param {EventModel} event The owning event.
   * @param {number} limit How many assets should be returned by each api call.
   */
  constructor(event, limit) {
    super(AssetModel, {
      eventId: event.getProperty('identifier')
    }, limit);

    this._event = event;
    this.setApiPath(`/events/${event.getProperty('identifier')}/assets`);
  }

  //getFeaturedAsset() {
  //  const assetId = this._event.getProperty('featuredAssetId');
  //
  //  if (assetId === -1) {
  //    return null;
  //  }
  //
  //  // TODO get event id from collection or fetch it by id
  //}

  /**
   * Parses the response from the server and returns the data to use for model creation.
   *
   * @override
   */
  parse(data) {
    return data.data;
  }

  /**
   * Creates a model using a piece of data from the server.
   */
  createModel(modelData) {
    const model = new AssetModel(this._event);

    model._setProperties(modelData);

    return model;
  }
}

module.exports = AssetCollection;
