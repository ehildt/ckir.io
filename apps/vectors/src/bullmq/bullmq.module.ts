import { BullModule } from '@nestjs/bullmq';
import { DynamicModule, Module } from '@nestjs/common';
import { LoggerOptions } from 'pino';

import { BULLMQ_QUEUE } from '../constants/bullmq.constants';

import { MessagesProcessor } from './messages.processor';
import { ThreadsProcessor } from './threads.processor';
import { TopicsProcessor } from './topics.processor';

import { BullMQLoggerModule } from '@/bullmq-logger/bullmq-logger.module';
import { BullMQConfig } from '@/config-factory/config-factory.model';

type BullMQConfigFactory = (...deps: any[]) => Promise<BullMQConfig>;
type PinoConfigFactory = (...deps: any[]) => Promise<LoggerOptions>;

type BullMQModuleProps = {
  global?: boolean;
  inject?: Array<any>;
  useBullFactory: BullMQConfigFactory;
  usePinoFactory: PinoConfigFactory;
};

@Module({})
export class BullMQProcessorsModule {
  static registerAsync(options: BullMQModuleProps): DynamicModule {
    return {
      module: BullMQProcessorsModule,
      exports: [BullModule],
      global: options.global,
      providers: [MessagesProcessor, TopicsProcessor, ThreadsProcessor],
      imports: [
        BullMQLoggerModule.registerAsync({
          inject: options.inject,
          useFactory: options.usePinoFactory,
        }),
        BullModule.registerQueueAsync({
          name: BULLMQ_QUEUE.VECTORIZE_MESSAGE,
          inject: options.inject,
          useFactory: options.useBullFactory,
        }),
        BullModule.registerQueueAsync({
          name: BULLMQ_QUEUE.VECTORIZE_TOPIC,
          inject: options.inject,
          useFactory: options.useBullFactory,
        }),
        BullModule.registerQueueAsync({
          name: BULLMQ_QUEUE.VECTORIZE_THREAD,
          inject: options.inject,
          useFactory: options.useBullFactory,
        }),
      ],
    };
  }
}
