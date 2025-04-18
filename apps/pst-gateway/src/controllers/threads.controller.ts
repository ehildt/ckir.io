import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ThreadsService } from '@/services/threads.service';

import { GetThreadsReq, QueryLimit, QuerySkip, QueryTopicId } from '../decorators/gateway.decorators';

@ApiTags('Threads')
@Controller('threads')
export class ThreadsController {
  constructor(private readonly threadsService: ThreadsService) {}

  @GetThreadsReq()
  async threads(@QueryTopicId() topicId: string, @QueryLimit() limit?: number, @QuerySkip() skip?: number) {
    return this.threadsService.threads(topicId, { limit, skip });
  }
}
