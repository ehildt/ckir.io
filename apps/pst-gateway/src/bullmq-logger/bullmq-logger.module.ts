import { DynamicModule, Module } from '@nestjs/common';
import { LoggerOptions, pino } from 'pino';

import { PINO_LOGGER } from './bullmq-logger.constants';
import { BullMQLoggerService } from './bullmq-logger.service';

type PinoConfigFactory = (...deps: any[]) => Promise<LoggerOptions>;

type BullMQLoggerModuleProps = {
  isGlobal?: boolean;
  inject: Array<any>;
  useFactory: PinoConfigFactory;
};

@Module({})
export class BullMQLoggerModule {
  static register(options: BullMQLoggerModuleProps): DynamicModule {
    return {
      global: options.isGlobal,
      module: BullMQLoggerModule,
      exports: [PINO_LOGGER, BullMQLoggerService],
      providers: [
        BullMQLoggerService,
        {
          provide: PINO_LOGGER,
          inject: options.inject,
          useFactory: async (...deps) => pino(await options.useFactory(...deps)),
        },
      ],
    };
  }
}
