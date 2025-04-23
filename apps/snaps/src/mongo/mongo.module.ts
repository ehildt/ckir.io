import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MessageRepository } from './repositories/message.repository';
import { ThreadRepository } from './repositories/thread.repository';
import { TopicRepository } from './repositories/topic.repository';
import { MessageSchema, MessageSchemaDocument } from './schemas/message.schema';
import { ThreadSchema, ThreadSchemaDocument } from './schemas/thread.schema';
import { TopicSchema, TopicSchemaDocument } from './schemas/topic.schema';

import { MongoConfig } from '@/config-factory/config-factory.model';
import { MONGO_COLLECTION } from '@/constants/mongo.constants';

type MongoConfigFactory = (...deps: any[]) => Promise<MongoConfig>;

type MongoModuleProps = {
  global?: boolean;
  inject?: Array<any>;
  useFactory: MongoConfigFactory;
};

@Module({})
export class MongoModule {
  static registerAsync(options: MongoModuleProps): DynamicModule {
    return {
      module: MongoModule,
      global: options.global,
      exports: [MessageRepository, TopicRepository, ThreadRepository],
      providers: [MessageRepository, TopicRepository, ThreadRepository],
      imports: [
        MongooseModule.forRootAsync({
          inject: options.inject,
          useFactory: options.useFactory,
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
        ]),
      ],
    };
  }
}
