/**
 * Enum representing the possible states of a thread.
 *
 * This enum is used to define the accessibility and behavior of a thread within a topic.
 * The state determines whether the thread is active, deleted, restricted, or locked.
 *
 * @enum THREAD_MODE
 */
export enum ThreadsMode {
  /**
   * Thread is disabled.
   * The thread is disabled and cannot be interacted with or accessed by users.
   * This is typically used when the thread is inactive but not deleted.
   */
  DISABLED = 'DISABLED',

  /**
   * Thread is deleted.
   * The thread is deleted and should no longer be available in the system.
   * Any references to the thread will be removed or ignored.
   */
  DELETED = 'DELETED',

  /**
   * Thread is locked.
   * The thread is locked and no further messages or interactions are allowed.
   * This can be used to prevent further discussion or changes in the thread.
   */
  LOCKED = 'LOCKED',

  /**
   * Thread is restricted.
   * The thread has restricted access, meaning only certain users or groups can interact with it.
   * This can be used for moderated or private threads.
   */
  RESTRICTED = 'RESTRICTED',
}
