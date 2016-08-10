import { Symbols as CollectionSymbols } from '../collections/abstract/BaseCollection';

/**
 * Fully refetches the collection when updating.
 *
 * Used by MessageCollection and AdCollection.
 * @mixin updateReplaceMixin
 */
export default {

  /**
   * @inheritDoc
   */
  async [CollectionSymbols.getUpdatedItems]() {
    let modelList = await this.fetchRaw(this.fetchOptions);

    // TODO optimise
    return { removed: modelList, added: modelList };
  }
};
