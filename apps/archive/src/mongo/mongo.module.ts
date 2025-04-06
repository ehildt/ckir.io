import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigFactoryService } from '@/config-factory/config-factory.service';
import { MessageRepository } from '@/mongo/repositories/message.repository';
import { AttachmentSchema, AttachmentSchemaDocument } from '@/mongo/schemas/attachment.schema';
import { EmojiSchema, EmojiSchemaDocument } from '@/mongo/schemas/emoji.schema';
import { FlagSchema, FlagSchemaDocument } from '@/mongo/schemas/flag.schema';
import { MessageSchema, MessageSchemaDocument } from '@/mongo/schemas/message.schema';
import { ParticipantSchema, ParticipantSchemaDocument } from '@/mongo/schemas/participant.schema';
import { ThreadSchema, ThreadSchemaDocument } from '@/mongo/schemas/thread.schema';
import { TopicSchema, TopicSchemaDocument } from '@/mongo/schemas/topic.schema';

import { MONGO_COLLECTION } from './constants/mongo.constants';
import { ArgsSchema, ArgsSchemaDocument } from './schemas/args.schema';
import { MongoService } from './services/mongo.service';

@Module({
  exports: [MongoService],
  providers: [MessageRepository, MongoService, Logger],
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigFactoryService],
      useFactory: ({ mongoConfig }: ConfigFactoryService) => mongoConfig,
    }),
    MongooseModule.forFeature([
      {
        name: MessageSchemaDocument.name,
        schema: MessageSchema,
        collection: MONGO_COLLECTION.MESSAGES,
      },
      {
        name: TopicSchemaDocument.name,
        schema: TopicSchema,
        collection: MONGO_COLLECTION.TOPICS,
      },
      {
        name: ThreadSchemaDocument.name,
        schema: ThreadSchema,
        collection: MONGO_COLLECTION.THREADS,
      },
      {
        name: ParticipantSchemaDocument.name,
        schema: ParticipantSchema,
        collection: MONGO_COLLECTION.PARTICIPANTS,
      },
      {
        name: AttachmentSchemaDocument.name,
        schema: AttachmentSchema,
        collection: MONGO_COLLECTION.ATTACHMENTS,
      },
      {
        name: FlagSchemaDocument.name,
        schema: FlagSchema,
        collection: MONGO_COLLECTION.FLAGS,
      },
      {
        name: EmojiSchemaDocument.name,
        schema: EmojiSchema,
        collection: MONGO_COLLECTION.EMOJIS,
      },
      {
        name: ArgsSchemaDocument.name,
        schema: ArgsSchema,
        collection: MONGO_COLLECTION.ARGS,
      },
    ]),
  ],
})
export class MongoModule {}
