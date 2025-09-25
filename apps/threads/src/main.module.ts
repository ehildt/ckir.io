import { BullMQModule } from '@ckir.io/bullmq';
import { SocketIOModule } from '@ckir.io/socket-io';
import { Logger, Module } from '@nestjs/common';

import { ConfigFactoryModule } from './config-factory/config-factory.module';
import { ConfigFactoryService } from './config-factory/config-factory.service';
import { BULLMQ_QUEUE } from './constants/bullmq.constants';
import { ThreadsController } from './controllers/threads.controller';
import { ThreadProcessor } from './processors/thread.processor';
import { ThreadsService } from './services/threads.service';

@Module({
  imports: [
    ConfigFactoryModule.forRoot({ global: true }),
    BullMQModule.registerAsync({
      global: true,
      inject: [ConfigFactoryService],
      queues: [BULLMQ_QUEUE.BROADCAST_THREAD, BULLMQ_QUEUE.PERSIST_THREAD, BULLMQ_QUEUE.VECTORIZE_THREAD],
      processors: [ThreadProcessor],
      usePinoFactory: async ({ pinoConfig }: ConfigFactoryService) => pinoConfig,
      useBullFactory: async ({ bullMQConfig }: ConfigFactoryService) => bullMQConfig,
    }),
    SocketIOModule.registerAsync({
      global: true,
      inject: [ConfigFactoryService],
      useFactory: async ({ socketIOConfig }: ConfigFactoryService) => socketIOConfig,
    }),
  ],
  providers: [Logger, ThreadsService],
  controllers: [ThreadsController],
})
export class MainModule {}
