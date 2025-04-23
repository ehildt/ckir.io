import { Body, Controller, ParseEnumPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { GatewayMode } from '../constants/gateway-mode.constants';

import { PostThreadReq } from '@/decorators/threads.decorators';
import { ThreadReq } from '@/dtos/thread-req.dto';
import { ThreadsService } from '@/services/threads.service';

@ApiTags('MSG Gateway')
@Controller('gateway')
export class ThreadsController {
  constructor(private readonly threadService: ThreadsService) {}

  @PostThreadReq()
  async emit(
    @Body() thread: ThreadReq,
    @Query('gateway', new ParseEnumPipe(GatewayMode, { optional: true }))
    gateway?: GatewayMode,
  ) {
    await this.threadService.emit(thread, gateway);
  }
}
