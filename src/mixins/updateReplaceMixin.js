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
    const models = this.fetchRaw(this.fetchOptions);

    // TODO optimise
    return { removed: models, added: models };
  }
}
