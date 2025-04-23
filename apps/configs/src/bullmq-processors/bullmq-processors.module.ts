import { BullModule } from '@nestjs/bullmq';
import { DynamicModule, Module } from '@nestjs/common';
import { LoggerOptions } from 'pino';

import { MessageProcessor } from './message.processor';
import { ThreadProcessor } from './thread.processor';
import { TopicProcessor } from './topic.processor';

import { BullMQLoggerModule } from '@/bullmq-logger/bullmq-logger.module';
import { BullMQConfig } from '@/config-factory/config-factory.model';
import { BULLMQ_QUEUE } from '@/constants/bullmq.constants';

type BullMQConfigFactory = (...deps: any[]) => Promise<BullMQConfig>;
type PinoConfigFactory = (...deps: any[]) => Promise<LoggerOptions>;

type BullMQModuleProps = {
  global?: boolean;
  inject?: Array<any>;
  useBullFactory: BullMQConfigFactory;
  usePinoFactory: PinoConfigFactory;
};

@Module({})
export class BullMQModule {
  static registerAsync(options: BullMQModuleProps): DynamicModule {
    return {
      module: BullMQModule,
      exports: [BullModule],
      global: options.global,
      providers: [TopicProcessor, ThreadProcessor, MessageProcessor],
      imports: [
        BullMQLoggerModule.registerAsync({
          inject: options.inject,
          useFactory: options.usePinoFactory,
        }),
        BullModule.registerQueueAsync(
          {
            name: BULLMQ_QUEUE.BROADCAST_MESSAGE,
            inject: options.inject,
            useFactory: options.useBullFactory,
          },
          {
            name: BULLMQ_QUEUE.BROADCAST_TOPIC,
            inject: options.inject,
            useFactory: options.useBullFactory,
          },
          {
            name: BULLMQ_QUEUE.BROADCAST_THREAD,
            inject: options.inject,
            useFactory: options.useBullFactory,
          },
          {
            name: BULLMQ_QUEUE.PERSIST_MESSAGE,
            inject: options.inject,
            useFactory: options.useBullFactory,
          },
          {
            name: BULLMQ_QUEUE.PERSIST_TOPIC,
            inject: options.inject,
            useFactory: options.useBullFactory,
          },
          {
            name: BULLMQ_QUEUE.PERSIST_THREAD,
            inject: options.inject,
            useFactory: options.useBullFactory,
          },
          {
            name: BULLMQ_QUEUE.VECTORIZE_MESSAGE,
            inject: options.inject,
            useFactory: options.useBullFactory,
          },
          {
            name: BULLMQ_QUEUE.VECTORIZE_TOPIC,
            inject: options.inject,
            useFactory: options.useBullFactory,
          },
          {
            name: BULLMQ_QUEUE.VECTORIZE_THREAD,
            inject: options.inject,
            useFactory: options.useBullFactory,
          },
        ),
      ],
    };
  }
}
