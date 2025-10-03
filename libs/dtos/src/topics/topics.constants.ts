/**
 * Enum representing the possible states of a topic.
 *
 * This enum is used to control the behavior and accessibility of a topic. \
 * The state determines whether the topic is active, deleted, restricted, or locked.
 *
 * @enum TOPIC_MODE
 */
export enum TopicsMode {
  /**
   * Topic is disabled.
   * The topic is disabled and cannot be interacted with or accessed by users. \
   * This is often used when the topic is no longer active or needed.
   */
  DISABLED = 'DISABLED',

  /**
   * Topic is deleted.
   * The topic is deleted and should no longer be available in the system. \
   * Any references to the topic will be removed or ignored.
   */
  DELETED = 'DELETED',

  /**
   * Topic is locked. \
   * The topic is locked and no further threads or interactions are allowed. \
   * This can be used to prevent any changes to the topic's content.
   */
  LOCKED = 'LOCKED',

  /**
   * Topic is restricted. \
   * The topic has restricted access, and only certain users or groups may interact with it. \
   * Typically used for private or moderated topics.
   */
  RESTRICTED = 'RESTRICTED',
}
