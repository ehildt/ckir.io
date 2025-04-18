import { BullModule } from '@nestjs/bullmq';
import { DynamicModule, Module } from '@nestjs/common';
import { LoggerOptions } from 'pino';

import { BullMQLoggerModule } from '@/bullmq-logger/bullmq-logger.module';
import { BullMQConfig } from '@/config-factory/config-factory.model';
import { BULLMQ_QUEUE } from '@/constants/bullmq.constants';

import { MessageProcessor } from './message.processor';

type BullMQConfigFactory = (...deps: any[]) => Promise<BullMQConfig>;
type PinoConfigFactory = (...deps: any[]) => Promise<LoggerOptions>;

type BullMQModuleProps = {
  isGlobal?: boolean;
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
      global: options.isGlobal,
      providers: [MessageProcessor],
      imports: [
        BullMQLoggerModule.register({
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
            name: BULLMQ_QUEUE.PERSIST_MESSAGE,
            inject: options.inject,
            useFactory: options.useBullFactory,
          },
          {
            name: BULLMQ_QUEUE.VECTORIZE_MESSAGE,
            inject: options.inject,
            useFactory: options.useBullFactory,
          },
        ),
      ],
    };
  }
}
