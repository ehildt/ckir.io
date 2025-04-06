import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { TopicMode } from '@/archive/dtos/topic-req.dto';

@Schema({ timestamps: true })
export class TopicSchemaDocument extends Document {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, enum: TopicMode, required: false })
  mode: TopicMode;
}

export const TopicSchema = SchemaFactory.createForClass(TopicSchemaDocument);
