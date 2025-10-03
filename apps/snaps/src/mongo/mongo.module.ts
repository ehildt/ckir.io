import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';

import { PostsRepository } from './repositories/posts.repository';
import { ThreadsRepository } from './repositories/threads.repository';
import { TopicsRepository } from './repositories/topic.repository';
import { PostsSchema, PostsSchemaDocument } from './schemas/posts.schema';
import { ThreadSchema, ThreadsSchemaDocument } from './schemas/threads.schema';
import { TopicSchema, TopicsSchemaDocument } from './schemas/topics.schema';

import { MONGO_COLLECTION } from '@/constants/mongo.constants';

type MongoConfigFactory = (
  ...deps: any[]
) => Promise<MongooseModuleFactoryOptions>;

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
      exports: [PostsRepository, TopicsRepository, ThreadsRepository],
      providers: [PostsRepository, TopicsRepository, ThreadsRepository],
      imports: [
        MongooseModule.forRootAsync({
          inject: options.inject,
          useFactory: options.useFactory,
        }),
        MongooseModule.forFeature([
          {
            name: PostsSchemaDocument.name,
            schema: PostsSchema,
            collection: MONGO_COLLECTION.POSTS,
          },
          {
            name: TopicsSchemaDocument.name,
            schema: TopicSchema,
            collection: MONGO_COLLECTION.TOPICS,
          },
          {
            name: ThreadsSchemaDocument.name,
            schema: ThreadSchema,
            collection: MONGO_COLLECTION.THREADS,
          },
        ]),
      ],
    };
  }
}
