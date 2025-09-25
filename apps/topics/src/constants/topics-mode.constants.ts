/**
 * Enum representing the processing mode for a gateway.
 *
 * This mode controls how the event is handled after submission,
 * such as whether it's vectorized for semantic search or persisted for storage.
 * The `VECTORIZE` mode implies that the event will also be persisted (i.e., stored).
 *
 * @enum TopicsMode
 */
export enum TopicsMode {
  /**
   * Vectorize only.
   * The event will be converted into a vector embedding for use in
   * similarity search or large language model workflows, and it will be persisted (stored).
   * Persistence is automatically implied when the event is vectorized.
   */
  VECTORIZE = 'vectorize',

  /**
   * Persist only.
   * The event will be stored (e.g., in a database), but it will not be vectorized.
   * This mode is typically used for saving a event without needing it to be part of search workflows.
   */
  PERSIST = 'persist',
}
