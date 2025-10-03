import { DynamicModule, Module } from '@nestjs/common';
import { LoggerOptions, pino } from 'pino';

import { BULLMQ_PINO_LOGGER } from './bullmq-pino-logger.constants';
import { BullMQPinoLoggerService } from './bullmq-pino-logger.service';

type PinoConfigFactory = (...deps: any[]) => Promise<LoggerOptions>;

type BullMQLoggerModuleProps = {
  global?: boolean;
  inject: Array<any>;
  useFactory: PinoConfigFactory;
};

@Module({})
export class BullMQPinoLoggerModule {
  static registerAsync(options: BullMQLoggerModuleProps): DynamicModule {
    return {
      global: options.global,
      module: BullMQPinoLoggerModule,
      exports: [BULLMQ_PINO_LOGGER, BullMQPinoLoggerService],
      providers: [
        BullMQPinoLoggerService,
        {
          provide: BULLMQ_PINO_LOGGER,
          inject: options.inject,
          useFactory: async (...deps) =>
            pino(await options.useFactory(...deps)),
        },
      ],
    };
  }
}
