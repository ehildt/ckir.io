import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { TopicsMode } from '@/constants/topics.constants';

/**
 * Represents the schema for a discussion topic in the database.
 *
 * This schema includes topic metadata, computed analytics fields, and
 * moderation and organizational properties to support a wide range of
 * discussion-based applications.
 */
@Schema({ timestamps: true })
export class TopicsSchemaDocument extends Document {
  /**
   * The unique identifier of the publisher (sender) of the topic.
   *
   * @example "usr_4a1f23b7c2d84e57b12c5f9a"
   */
  @Prop({ type: String, required: true })
  publisherId: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  hash: string;

  /**
   * The title of the topic.
   */
  @Prop({ type: String, required: true })
  title: string;

  /**
   * The operational mode of the topic, defined by a predefined enumeration.
   * Can be used to differentiate between various topic behaviors or restrictions.
   */
  @Prop({ type: String, enum: TopicsMode })
  mode?: TopicsMode;

  /**
   * A short description of the topic's purpose or scope.
   */
  @Prop({ type: String })
  description?: string;

  /**
   * The timestamp of the most recent activity (e.g. new thread or reply) in this topic.
   */
  @Prop({ type: Date })
  lastActivityAt?: Date;

  /**
   * The total number of threads currently associated with this topic,
   * including both active and deleted threads unless otherwise specified.
   */
  @Prop({ type: Number, default: 0 })
  threadCount: number;

  /**
   * The number of threads under this topic that have been marked as deleted.
   */
  @Prop({ type: Number, default: 0 })
  deletedThreadCount: number;

  /**
   * The total number of unique users who have ever contributed to threads
   * in this topic, including those whose threads are now deleted.
   */
  @Prop({ type: Number, default: 0 })
  participantCount: number;

  /**
   * The number of unique users currently participating in non-deleted threads
   * under this topic. Users whose only contributions were deleted are excluded.
   */
  @Prop({ type: Number, default: 0 })
  activeParticipantCount: number;

  /**
   * A list of tags or categories associated with this topic, used for filtering or grouping.
   */
  @Prop({ type: [String] })
  tags: Array<string>;
}

export const TopicSchema = SchemaFactory.createForClass(TopicsSchemaDocument);

TopicSchema.index({ mode: 1 });
TopicSchema.index({ title: 1 });
