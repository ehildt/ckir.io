import { DynamicModule, Module } from '@nestjs/common';
import { pino } from 'pino';

import { PINO_LOGGER } from './bullmq-logger.constants';
import { BullMQLoggerService } from './bullmq-logger.service';

type PinoConfigFactory = (...deps: any[]) => pino.LoggerOptions;

type BullMQLoggerModuleProps = {
  isGlobal?: boolean;
  imports?: Array<any>;
  inject?: Array<any>;
  providers?: Array<any>;
  useFactory: PinoConfigFactory;
};

@Module({})
export class BullMQLoggerModule {
  static register(options: BullMQLoggerModuleProps): DynamicModule {
    return {
      module: BullMQLoggerModule,
      global: options.isGlobal,
      imports: options.imports,
      exports: [PINO_LOGGER, BullMQLoggerService],
      providers: [
        ...(options?.providers ?? []),
        BullMQLoggerService,
        {
          provide: PINO_LOGGER,
          inject: options.inject ?? [],
          useFactory: (...deps) => pino(options.useFactory(...deps)),
        },
      ],
    };
  }
}
