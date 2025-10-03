import { ProcessingMode, ThreadsReq } from '@ckir.io/dtos';
import { Body, Controller, ParseEnumPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PostThreadReq } from '@/decorators/threads.decorators';
import { ThreadsService } from '@/services/threads.service';

@ApiTags('Threads')
@Controller('threads')
export class ThreadsController {
  constructor(private readonly threadService: ThreadsService) {}

  @PostThreadReq()
  async emit(
    @Body() thread: ThreadsReq,
    @Query('mode', new ParseEnumPipe(ProcessingMode, { optional: true }))
    mode?: ProcessingMode,
  ) {
    await this.threadService.emit(thread, mode);
  }
}
