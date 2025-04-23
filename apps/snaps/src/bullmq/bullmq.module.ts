import { BullModule } from '@nestjs/bullmq';
import { DynamicModule, Module } from '@nestjs/common';
import { LoggerOptions } from 'pino';

import { BULLMQ_QUEUE } from '../constants/bullmq.constants';

import { PstMsgProcessor } from './pst-msg.processor';
import { PstThrProcessor } from './pst-thr.processor';
import { PstTpcProcessor } from './pst-tpc.processor';

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
      providers: [PstMsgProcessor, PstTpcProcessor, PstThrProcessor],
      imports: [
        BullMQLoggerModule.registerAsync({
          inject: options.inject,
          useFactory: options.usePinoFactory,
        }),
        BullModule.registerQueueAsync({
          name: BULLMQ_QUEUE.PERSIST_MESSAGE,
          inject: options.inject,
          useFactory: options.useBullFactory,
        }),
        BullModule.registerQueueAsync({
          name: BULLMQ_QUEUE.PERSIST_TOPIC,
          inject: options.inject,
          useFactory: options.useBullFactory,
        }),
        BullModule.registerQueueAsync({
          name: BULLMQ_QUEUE.PERSIST_THREAD,
          inject: options.inject,
          useFactory: options.useBullFactory,
        }),
      ],
    };
  }
}
