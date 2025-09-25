import { BullModule } from '@nestjs/bullmq';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { LoggerOptions } from 'pino';

import { BullMQLoggerModule } from '../logger/bullmq-logger.module';

import { BullMQConfig } from './bullmq.model';

type BullMQConfigFactory = (...deps: any[]) => Promise<BullMQConfig>;
type PinoConfigFactory = (...deps: any[]) => Promise<LoggerOptions>;

type BullMQModuleProps = {
  global?: boolean;
  inject: Array<any>;
  queues: Array<string>;
  processors: Array<Provider>;
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
      providers: options.processors,
      imports: [
        BullMQLoggerModule.registerAsync({
          inject: options.inject,
          useFactory: options.usePinoFactory,
        }),
        BullModule.registerQueueAsync(
          ...options.queues.map((name) => ({
            name,
            inject: options.inject,
            useFactory: options.useBullFactory,
          })),
        ),
      ],
    };
  }
}
