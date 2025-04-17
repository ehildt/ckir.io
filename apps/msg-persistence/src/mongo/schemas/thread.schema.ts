import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { ThreadMode } from '@/dtos/thread-req.dto';

@Schema({ timestamps: true })
export class ThreadSchemaDocument extends Document {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, enum: ThreadMode, required: false })
  mode: ThreadMode;
}

export const ThreadSchema = SchemaFactory.createForClass(ThreadSchemaDocument);
