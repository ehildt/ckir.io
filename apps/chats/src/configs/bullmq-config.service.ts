import {
  BullMQArgsAdapter,
  BullMQArgsSchema,
  BullMQConfigAdapter,
  BullMQConfigSchema,
  BullMQPinoAdapter,
  BullMQPinoLoggerSchema,
} from '@ehildt/ckir-bullmq';
import { CacheReturnValue } from '@ehildt/ckir-config-factory';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BullMQConfigService {
  @CacheReturnValue(BullMQArgsSchema)
  get bullMQArgs() {
    return BullMQArgsAdapter();
  }

  @CacheReturnValue(BullMQConfigSchema)
  get bullMQConfig() {
    return BullMQConfigAdapter();
  }

  @CacheReturnValue(BullMQPinoLoggerSchema)
  get pinoConfig() {
    return BullMQPinoAdapter();
  }
}
