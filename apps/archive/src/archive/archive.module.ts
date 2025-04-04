import { BullModule } from '@nestjs/bullmq';
import { ConsoleLogger, Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppService } from '@/app.service';
import {
  ATTACHMENTS_COLLECTION,
  BULLMQ_PERSISTANCE_QUEUE,
  BULLMQ_VECTORIZE_QUEUE,
  EMOJIS_COLLECTION,
  FLAGS_COLLECTION,
  MESSAGES_COLLECTION,
  PARTICIPANTS_COLLECTION,
  THREADS_COLLECTION,
  TOPICS_COLLECTION,
} from '@/archive/constants /app.constants';
import { ArchiveController } from '@/archive/controllers/archive.controller';
import { PersistProcessor } from '@/archive/processors/persist.processor';
import { VectorizeProcessor } from '@/archive/processors/vectorize.processor';
import { ConfigFactoryModule } from '@/config-factory/config-factory.module';
import { ConfigFactoryService } from '@/config-factory/config-factory.service';
import { MessageRepository } from '@/mongo/repositories/message.repository';
import { AttachmentSchema, AttachmentSchemaDocument } from '@/mongo/schemas/attachment.schema';
import { EmojiSchema, EmojiSchemaDocument } from '@/mongo/schemas/emoji.schema';
import { FlagSchema, FlagSchemaDocument } from '@/mongo/schemas/flag.schema';
import { MessageSchema, MessageSchemaDocument } from '@/mongo/schemas/message.schema';
import { ParticipantSchema, ParticipantSchemaDocument } from '@/mongo/schemas/participant.schema';
import { ThreadSchema, ThreadSchemaDocument } from '@/mongo/schemas/thread.schema';
import { TopicSchema, TopicSchemaDocument } from '@/mongo/schemas/topic.schema';
import { MongoService } from '@/mongo/services/mongo.service';

@Module({
  imports: [
    ConfigFactoryModule.forRoot({ isGlobal: true }),
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
    BullModule.registerQueueAsync(
      {
        inject: [ConfigFactoryService],
        name: BULLMQ_PERSISTANCE_QUEUE,
        useFactory: async ({ bullMQConfig }: ConfigFactoryService) => bullMQConfig,
      },
      {
        inject: [ConfigFactoryService],
        name: BULLMQ_VECTORIZE_QUEUE,
        useFactory: async ({ bullMQConfig }: ConfigFactoryService) => bullMQConfig,
      },
    ),
  ],
  providers: [AppService, ConsoleLogger, MongoService, PersistProcessor, VectorizeProcessor, MessageRepository, Logger],
  controllers: [ArchiveController],
})
export class ArchiveModule {}
