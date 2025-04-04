import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  ATTACHMENTS_COLLECTION,
  EMOJIS_COLLECTION,
  FLAGS_COLLECTION,
  MESSAGES_COLLECTION,
  PARTICIPANTS_COLLECTION,
  THREADS_COLLECTION,
  TOPICS_COLLECTION,
} from '@/archive/constants /app.constants';
import { ConfigFactoryService } from '@/config-factory/config-factory.service';
import { MessageRepository } from '@/mongo/repositories/message.repository';
import { AttachmentSchema, AttachmentSchemaDocument } from '@/mongo/schemas/attachment.schema';
import { EmojiSchema, EmojiSchemaDocument } from '@/mongo/schemas/emoji.schema';
import { FlagSchema, FlagSchemaDocument } from '@/mongo/schemas/flag.schema';
import { MessageSchema, MessageSchemaDocument } from '@/mongo/schemas/message.schema';
import { ParticipantSchema, ParticipantSchemaDocument } from '@/mongo/schemas/participant.schema';
import { ThreadSchema, ThreadSchemaDocument } from '@/mongo/schemas/thread.schema';
import { TopicSchema, TopicSchemaDocument } from '@/mongo/schemas/topic.schema';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigFactoryService],
      useFactory: ({ mongoConfig }: ConfigFactoryService) => mongoConfig,
    }),
    MongooseModule.forFeature([
      {
        name: MessageSchemaDocument.name,
        schema: MessageSchema,
        collection: MESSAGES_COLLECTION,
      },
      {
        name: TopicSchemaDocument.name,
        schema: TopicSchema,
        collection: TOPICS_COLLECTION,
      },
      {
        name: ThreadSchemaDocument.name,
        schema: ThreadSchema,
        collection: THREADS_COLLECTION,
      },
      {
        name: ParticipantSchemaDocument.name,
        schema: ParticipantSchema,
        collection: PARTICIPANTS_COLLECTION,
      },
      {
        name: AttachmentSchemaDocument.name,
        schema: AttachmentSchema,
        collection: ATTACHMENTS_COLLECTION,
      },
      {
        name: FlagSchemaDocument.name,
        schema: FlagSchema,
        collection: FLAGS_COLLECTION,
      },
      {
        name: EmojiSchemaDocument.name,
        schema: EmojiSchema,
        collection: EMOJIS_COLLECTION,
      },
    ]),
  ],
  providers: [MessageRepository, Logger],
})
export class MongoModule {}
