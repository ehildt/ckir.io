import { BullModule } from '@nestjs/bullmq';
import { DynamicModule, Module, Provider } from '@nestjs/common';

import { BullMQConfig } from './bullmq.model';

type BullMQConfigFactory = (...deps: any[]) => Promise<BullMQConfig>;

type BullMQModuleProps = {
  global?: boolean;
  inject: Array<any>;
  queues: Array<string>;
  processors: Array<Provider>;
  useBullFactory: BullMQConfigFactory;
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
