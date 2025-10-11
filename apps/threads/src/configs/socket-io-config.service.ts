import { CacheReturnValue } from '@ckir.io/decorators';
import { SocketIOAdapter, SocketIOConfigSchema } from '@ckir.io/socket-io';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SocketIOConfigService {
  @CacheReturnValue(SocketIOConfigSchema)
  get socketIOConfig() {
    return SocketIOAdapter('TOPIC');
  }
}
