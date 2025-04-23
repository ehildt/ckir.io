import { ThreadReq } from '@ckir.io/dtos';
import { Body, Controller, ParseEnumPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { GatewayMode } from '../constants/gateway-mode.constants';

import { PostThreadReq } from '@/decorators/threads.decorators';
import { ThreadsService } from '@/services/threads.service';

@ApiTags('Threads')
@Controller('threads')
export class ThreadsController {
  constructor(private readonly threadService: ThreadsService) {}

  @PostThreadReq()
  async emit(
    @Body() thread: ThreadReq,
    @Query('mode', new ParseEnumPipe(GatewayMode, { optional: true }))
    mode?: GatewayMode,
  ) {
    await this.threadService.emit(thread, mode);
  }
}
