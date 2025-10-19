import { ThreadsReq } from '@ehildt/ckir-dtos';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { QueryHash } from '@/decorators/posts.decorator';
import {
  GetThreadsReq,
  QueryLimit,
  QuerySkip,
  QueryTopicId,
} from '@/decorators/thread.decorators';
import { ThreadsService } from '@/services/threads.service';

@ApiTags('Threads')
@Controller('threads')
export class ThreadsController {
  constructor(private readonly threadsService: ThreadsService) {}

  @GetThreadsReq()
  async threads(
    @QueryTopicId() topicId: string,
    @QueryLimit() limit?: number,
    @QuerySkip() skip?: number,
  ) {
    return this.threadsService.threads(topicId, { limit, skip });
  }

  @Post()
  @ApiBody({
    type: ThreadsReq,
    required: true,
  })
  @ApiResponse({
    type: String,
  })
  async findOneAndUpdate(@Body() body: ThreadsReq) {
    return this.threadsService.insertIfNotExists(body);
  }

  @Get(':hash')
  @ApiParam({ name: 'hash', type: String })
  async findByHash(@QueryHash() hash: string) {
    return this.threadsService.findByHash(hash);
  }
}
