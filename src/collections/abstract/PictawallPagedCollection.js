import PagedCollection from './PagedCollection';
import { Symbols as FetchSymbols } from '../../mixins/FetchMixin';
import { Symbols as CollectionSymbols } from './BaseCollection';

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

  /**
   * @inheritDoc
   */
  async [CollectionSymbols.getUpdatedItems](since) {
    return {
      added: await this.fetchRaw(Object.assign(this.fetchOptions, { since }))
    };
  }
}
