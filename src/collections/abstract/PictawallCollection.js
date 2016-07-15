import BaseCollection from './BaseCollection';
import { Symbols as FetchSymbols } from '../../mixins/FetchMixin';

/**
 * Collection of event ads.
 *
 * @class PictawallCollection
 * @extends BaseCollection
 */
export default class PictawallCollection extends BaseCollection {

  /**
   * @param {!Sdk} sdk - The SDK instance.
   */
  constructor(sdk) {
    super(sdk);
  }

  /**
   * @inheritDoc
   */
  [FetchSymbols.parseResponse](response) {
    return super[FetchSymbols.parseResponse](response).data;
  }
}
