import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { MessageMode } from '@/archive/constants /message-req.constants';
import { MessageEmojiReq } from '@/archive/dtos/message-emoji.dto';
import { MessageFlagReq } from '@/archive/dtos/message-flag.dto';

import { MONGO_POPULATE } from '../constants/mongo.constants';
import { AttachmentSchemaDocument } from './attachment.schema';
import { ThreadSchemaDocument } from './thread.schema';
import { TopicSchemaDocument } from './topic.schema';

const EMOJI = {
  name: { type: String, required: true },
  count: { type: Number, default: 0 },
};

const FLAG = {
  name: { type: String, required: true },
  agree: { type: Number, default: 0 },
  disagree: { type: Number, default: 0 },
};

@Schema({ timestamps: true })
export class MessageSchemaDocument extends Document {
  @Prop({ type: String, required: true })
  publisherId: string;

  @Prop({ type: Types.ObjectId, ref: TopicSchemaDocument.name, name: MONGO_POPULATE.TOPIC })
  topicId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: ThreadSchemaDocument.name, name: MONGO_POPULATE.THREAD })
  threadId: Types.ObjectId;

  @Prop({ type: String, required: true, maxlength: 5000 })
  text: string;

  @Prop({ type: String, required: false })
  recipientId?: string;

  @Prop({ type: Types.ObjectId, ref: MessageSchemaDocument.name, required: false, name: MONGO_POPULATE.MESSAGE })
  quoteId?: Types.ObjectId;

  @Prop({ type: String, enum: MessageMode, required: false })
  mode?: MessageMode;

  @Prop({
    required: false,
    type: [EMOJI],
  })
  emojis: Array<MessageEmojiReq>;

  @Prop({
    required: false,
    type: [FLAG],
  })
  flags?: Array<MessageFlagReq>;

  @Prop({
    required: false,
    type: [{ type: Types.ObjectId, ref: AttachmentSchemaDocument.name, name: MONGO_POPULATE.ATTACHMENTS }],
  })
  attachments?: Array<Types.ObjectId>;
}

export const MessageSchema = SchemaFactory.createForClass(MessageSchemaDocument);

MessageSchema.index({ topic: 1, thread: 1, publisherId: 1 });
