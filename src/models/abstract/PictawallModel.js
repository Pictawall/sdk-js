'use strict';

import { SdkError } from '../../core/Errors';
import BaseModel from './BaseModel';
import { Symbols as FetchSymbols } from '../../mixins/FetchMixin';

/**
 * @class PictawallModel
 * @extends BaseModel
 */
export default class PictawallModel extends BaseModel {

  /**
   * @param {!Sdk} sdk The SDK in which this model is running.
   */
  constructor(sdk) {
    super(sdk);
  }

  /**
   * Returns the identifier of the model.
   * @returns {*}
   */
  get id() {
    const id = this.getProperty('id');

    if (!id) {
      throw new SdkError(this, 'This model does not have an ID.');
    }

    return id;
  }

  /**
   * @inheritDoc
   */
  [FetchSymbols.parseResponse](response) {
    return response.data;
  }
}
