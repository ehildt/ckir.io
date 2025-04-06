export const MONGO_COLLECTION = Object.freeze({
  MESSAGES: 'MESSAGES',
  TOPICS: 'TOPICS',
  THREADS: 'THREADS',
  PARTICIPANTS: 'PARTICIPANTS',
  ATTACHMENTS: 'ATTACHMENTS',
  FLAGS: 'FLAGS',
  EMOJIS: 'EMOJIS',
  ARGS: 'ARGS',
} as const);

export const MONGO_POPULATE = {
  EMOJIS: 'emojis',
  FLAGS: 'flags',
  TOPIC: 'topic',
  THREAD: 'thread',
  ATTACHMENTS: 'attachments',
  MESSAGE: 'message',
} as const;
