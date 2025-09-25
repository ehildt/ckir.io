import { ThreadReq } from '@ckir.io/dtos';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetThreadsReq, QueryLimit, QuerySkip, QueryTopicId } from '@/decorators/thread.decorators';
import { ThreadsService } from '@/services/threads.service';

@ApiTags('Threads')
@Controller('threads')
export class ThreadsController {
  constructor(private readonly threadsService: ThreadsService) {}

  @GetThreadsReq()
  async threads(@QueryTopicId() topicId: string, @QueryLimit() limit?: number, @QuerySkip() skip?: number) {
    return this.threadsService.threads(topicId, { limit, skip });
  }

  @Post()
  @ApiBody({
    type: ThreadReq,
    required: true,
  })
  @ApiResponse({
    type: String,
  })
  async insertOne(@Body() body: ThreadReq) {
    return this.threadsService.insertOne(body);
  }
}
