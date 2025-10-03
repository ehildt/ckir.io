import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { TopicsSchemaDocument } from './topics.schema';

import { ThreadsMode } from '@/constants/threads.constants';

/**
 * Represents the schema for a discussion thread in the database.
 *
 * This schema includes thread-specific metadata, including topic association, creator, mode, etc.
 */
@Schema({ timestamps: true })
export class ThreadsSchemaDocument extends Document {
  /**
   * The unique identifier of the publisher (sender) of the thread.
   *
   * @example "usr_4a1f23b7c2d84e57b12c5f9a"
   */
  @Prop({ type: String, required: true })
  publisherId: string;

  // ! We hash title.toLowerCase() to enforce case-insensitive uniqueness,
  // ! while keeping the original title case in the database.
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  hash: string;

  /**
   * The title of the thread.\
   * This is the primary identifier for the thread.
   *
   * @example "Best Cookie Recipes"
   */
  @Prop({ type: String, required: true })
  title: string;

  /**
   * The operational mode of the thread, defined by a predefined enumeration.
   * Can be used to differentiate between various thread behaviors or restrictions.
   */
  @Prop({ type: String, enum: ThreadsMode })
  mode?: ThreadsMode;

  /**
   * A short description of the thread's purpose or scope.
   */
  @Prop({ type: String })
  description?: string;

  /**
   * The reference to the topic this thread belongs to.\
   * This creates an association between the thread and its parent topic.
   *
   * @example "topic123"
   */
  @Prop({ type: Types.ObjectId, ref: TopicsSchemaDocument.name })
  topicId: string;

  /**
   * The timestamp of the most recent activity (e.g., new reply, thread update) in this thread.
   *
   * @example "2023-08-17T12:34:56Z"
   */
  @Prop({ type: Date })
  lastActivityAt?: Date;

  /**
   * The total number of replies or messages associated with this thread.\
   * This provides insight into how much activity the thread has generated.
   *
   * @example 15
   */
  @Prop({ type: Number, default: 0 })
  replyCount: number;

  /**
   * The total number of participants who have contributed to this thread.\
   * This can help track engagement for the thread.
   *
   * @example 8
   */
  @Prop({ type: Number, default: 0 })
  participantCount: number;

  /**
   * A list of tags or categories associated with this thread.\
   * These can be used to group or categorize threads.
   *
   * @example ["cookies", "desserts", "baking"]
   */
  @Prop({ type: [String] })
  tags?: Array<string>;
}

export const ThreadSchema = SchemaFactory.createForClass(ThreadsSchemaDocument);

ThreadSchema.index({ mode: 1 });
ThreadSchema.index({ title: 1 });
