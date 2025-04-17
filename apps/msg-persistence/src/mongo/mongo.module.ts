import { Global, Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigFactoryService } from '@/config-factory/config-factory.service';
import { MessageRepository } from '@/mongo/repositories/message.repository';
import { AttachmentSchema, AttachmentSchemaDocument } from '@/mongo/schemas/attachment.schema';
import { MessageSchema, MessageSchemaDocument } from '@/mongo/schemas/message.schema';
import { ThreadSchema, ThreadSchemaDocument } from '@/mongo/schemas/thread.schema';
import { TopicSchema, TopicSchemaDocument } from '@/mongo/schemas/topic.schema';

import { MONGO_COLLECTION } from '../constants/mongo.constants';
import { MongoService } from './services/mongo.service';

// ! Dynamic module!!!

@Global()
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
        name: AttachmentSchemaDocument.name,
        schema: AttachmentSchema,
        collection: MONGO_COLLECTION.ATTACHMENTS,
      },
    ]),
  ],
})
export class MongoModule {}
