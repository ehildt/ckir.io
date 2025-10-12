import {
  PostsAttachmentReq,
  PostsEmojiReq,
  PostsFlagReq,
  PostsMode,
} from '@ckir.io/dtos';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { ThreadsSchemaDocument } from './threads.schema';
import { TopicsSchemaDocument } from './topics.schema';

const EMOJI = {
  _id: false,
  label: { type: String, required: true },
  count: { type: Number, default: 0 },
};

const FLAG = {
  _id: false,
  label: { type: String, required: true },
  agreeCount: { type: Number, default: 0 },
  disagreeCount: { type: Number, default: 0 },
};

const ATTACHMENT = {
  _id: false,
  fileId: { type: String, required: true },
  filename: { type: String, required: true },
  mimeType: { type: String, required: true },
  fileSize: { type: Number, required: true },
  url: { type: String, required: true },
  uploadedAt: { type: Date, required: true },
  meta: { type: Object, required: false },
};

/**
 * Represents a message in the system.
 * This schema contains details about the message's publisher, recipient, content,
 * associated topic, thread, and any emojis, flags, or attachments.
 */
@Schema({ timestamps: true })
export class PostsSchemaDocument extends Document {
  /**
   * The unique identifier of the publisher (sender) of the message.
   *
   * @example "usr_4a1f23b7c2d84e57b12c5f9a"
   */
  @Prop({ type: String, required: true })
  publisherId: string;

  /**
   * The topic to which this message belongs.
   * This is a reference to the `TopicSchemaDocument`.
   *
   * @example "topic_983bc3f1a9e940efa21a1c48"
   */
  @Prop({
    type: Types.ObjectId,
    ref: TopicsSchemaDocument.name,
    required: true,
  })
  topicId: Types.ObjectId;

  /**
   * The thread to which this message belongs.
   * This is a reference to the `ThreadSchemaDocument`.
   *
   * @example "thread_b201ee3f43d74cd4a6e4dd84"
   */
  @Prop({
    type: Types.ObjectId,
    ref: ThreadsSchemaDocument.name,
    required: true,
  })
  threadId: Types.ObjectId;

  /**
   * The identifier of the message recipient.
   * This field is optional as the message might not have a specific recipient.
   *
   * @example "usr_5de8c20a4d134c1d9d45f13a"
   */
  @Prop({ type: String })
  recipientId?: string;

  /**
   * The message that this message is quoting, if applicable.
   * This is a reference to another `MessageSchemaDocument`.
   *
   * @example "msg_8af23b761ee04bb392a4f9dc"
   */
  @Prop({ type: Types.ObjectId, ref: PostsSchemaDocument.name })
  quoteId?: Types.ObjectId;

  /**
   * The operational mode of the message.
   * This field is optional and determines the behavior of the message.
   *
   * @example "RESTRICTED"
   */
  @Prop({ type: String, enum: PostsMode })
  mode?: PostsMode;

  // ! We hash text.toLowerCase() to enforce case-insensitive uniqueness,
  // ! while keeping the original text case in the database.
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  hash: string;

  /**
   * The textual content of the message.
   *
   * @example "Hey, did you check the new design doc I shared earlier?"
   */
  @Prop({ type: String, required: true, maxlength: 5000 })
  text: string;

  /**
   * A list of emojis associated with the message.
   * Each emoji is represented with a label and a count of how many times it was used.
   *
   * @example [{ label: "laugh", count: 5 }]
   */
  @Prop({ type: [EMOJI] })
  emojis?: Array<PostsEmojiReq>;

  /**
   * A list of flags associated with the post.
   * Each flag has a label and counters for agreeCount/disagreeCount votes.
   *
   * @example [{ label: "MEME", agreeCount: 3, disagreeCount: 1 }]
   */
  @Prop({ type: [FLAG] })
  flags?: Array<PostsFlagReq>;

  /**
   * A list of attachments associated with the post.
   *
   * @example ["attachment_6803d03002f81ca0e6a7992a"]
   */
  @Prop({ type: [ATTACHMENT] })
  attachments?: Array<PostsAttachmentReq>;
}

export const PostsSchema = SchemaFactory.createForClass(PostsSchemaDocument);

PostsSchema.index({ topicId: 1 });
PostsSchema.index({ threadId: 1 });
PostsSchema.index({ topicId: 1, threadId: 1 });
PostsSchema.index({ topicId: 1, threadId: 1, publisherId: 1 });
