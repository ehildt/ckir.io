/**
 * Enum representing the possible states of a message.
 *
 * This enum is used to define the accessibility and behavior of a message within a thread.
 * The state determines whether the message is active, deleted, restricted, or locked.
 *
 * @enum PostsMode
 */
export enum PostsMode {
  /**
   * Message is disabled.
   * The message is disabled and cannot be interacted with or accessed by users.
   * This is typically used when the message is inactive but not deleted.
   */
  DISABLED = 'DISABLED',

  /**
   * Message is deleted.
   * The message is deleted and should no longer be available in the system.
   * Any references to the message will be removed or ignored.
   */
  DELETED = 'DELETED',

  /**
   * Message is locked.
   * The message is locked and no further messages or interactions are allowed.
   * This can be used to prevent further discussion or changes in the message.
   */
  LOCKED = 'LOCKED',

  /**
   * Message is restricted.
   * The message has restricted access, meaning only certain users or groups can interact with it.
   * This can be used for moderated or private messages.
   */
  RESTRICTED = 'RESTRICTED',
}
