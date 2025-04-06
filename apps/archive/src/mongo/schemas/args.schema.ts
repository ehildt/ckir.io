import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ArgsSchemaDocument extends Document {
  @Prop({ type: Boolean, default: false })
  pm: boolean;

  @Prop({ type: Boolean, default: false })
  persist: boolean;

  @Prop({ type: Boolean, default: false })
  vectorize: boolean;
}

export const ArgsSchema = SchemaFactory.createForClass(ArgsSchemaDocument);
