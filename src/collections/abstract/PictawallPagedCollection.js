import { Symbols as FetchSymbols } from '../../mixins/FetchMixin';
import PagedCollection from './PagedCollection';

/**
 * Collection of event ads.
 *
 * @class PictawallPagedCollection
 * @extends PagedCollection
 */
export default class PictawallPagedCollection extends PagedCollection {

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
