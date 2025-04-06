import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { MONGO_COLLECTION } from '../constants/mongo.constants';

@Schema({ timestamps: true })
export class MessageSchemaDocument extends Document {
  @Prop({ type: String, required: true })
  publisherId: string;

  @Prop({ type: String, required: true, maxlength: 5000 })
  message: string;

  @Prop({ type: Array<string>, required: false })
  refAI: Array<string>;

  @Prop({ type: String, required: false })
  refQuoteId?: string;

  @Prop({ type: Array<Types.ObjectId>, ref: MONGO_COLLECTION.EMOJIS, required: false })
  refEmojis?: Array<Types.ObjectId>;

  @Prop({ type: Array<Types.ObjectId>, ref: MONGO_COLLECTION.FLAGS, required: false })
  refFlags?: Array<Types.ObjectId>;

  @Prop({ type: Types.ObjectId, ref: MONGO_COLLECTION.TOPICS, required: false })
  topic?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: MONGO_COLLECTION.THREADS, required: false })
  thread?: Types.ObjectId;

  @Prop({ type: Array<Types.ObjectId>, ref: MONGO_COLLECTION.PARTICIPANTS, required: false })
  refParticipants?: Array<Types.ObjectId>;

  @Prop({ type: Array<Types.ObjectId>, ref: MONGO_COLLECTION.ATTACHMENTS, required: false })
  attachments?: Array<Types.ObjectId>;

  @Prop({ type: Types.ObjectId, ref: MONGO_COLLECTION.ARGS, required: false })
  args?: Types.ObjectId;
}

export const MessageSchema = SchemaFactory.createForClass(MessageSchemaDocument);

MessageSchema.index({ publisherId: 1 });
MessageSchema.index({ topic: 1, thread: 1 });
MessageSchema.index({ refEmojis: 1 });
MessageSchema.index({ refFlags: 1 });
