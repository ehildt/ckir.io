import {
  BullMQArgsAdapter,
  BullMQArgsSchema,
  BullMQConfigAdapter,
  BullMQConfigSchema,
  BullMQPinoAdapter,
  BullMQPinoLoggerSchema,
} from '@ckir.io/bullmq';
import { CacheReturnValue } from '@ckir.io/decorators';
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
