/**
 * Enum representing the possible states of a post.
 *
 * This enum is used to define the accessibility and behavior of a post within a thread.
 * The state determines whether the post is active, deleted, restricted, or locked.
 *
 * @enum PostsMode
 */
export enum PostsMode {
  /**
   * Post is disabled.
   * The post is disabled and cannot be interacted with or accessed by users.
   * This is typically used when the post is inactive but not deleted.
   */
  DISABLED = 'DISABLED',

  /**
   * Post is deleted.
   * The post is deleted and should no longer be available in the system.
   * Any references to the post will be removed or ignored.
   */
  DELETED = 'DELETED',

  /**
   * Post is locked.
   * The post is locked and no further posts or interactions are allowed.
   * This can be used to prevent further discussion or changes in the post.
   */
  LOCKED = 'LOCKED',

  /**
   * Post is restricted.
   * The post has restricted access, meaning only certain users or groups can interact with it.
   * This can be used for moderated or private posts.
   */
  RESTRICTED = 'RESTRICTED',
}
