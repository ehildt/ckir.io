/**
 * Enum representing the processing mode for a message.
 *
 * This mode controls how the message is handled after submission,
 * such as whether it's vectorized for semantic search or persisted for storage.
 * The `VECTORIZE` mode implies that the message will also be persisted (i.e., stored).
 *
 * @enum MessageMode
 */
export enum MessageMode {
  /**
   * Vectorize only.
   * The message will be converted into a vector embedding for use in
   * similarity search or large language model workflows, and it will be persisted (stored).
   * Persistence is automatically implied when the message is vectorized.
   */
  VECTORIZE = 'vectorize',

  /**
   * Persist only.
   * The message will be stored (e.g., in a database), but it will not be vectorized.
   * This mode is typically used for saving a message without needing it to be part of search workflows.
   */
  PERSIST = 'persist',
}
