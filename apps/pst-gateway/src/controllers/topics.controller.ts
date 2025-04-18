import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { TopicsService } from '@/services/topics.service';

import { GetTopicsReq, QueryLimit, QuerySkip } from '../decorators/gateway.decorators';

@ApiTags('Topics')
@Controller('topics')
export class TopicsController {
  constructor(private readonly TopicsService: TopicsService) {}

  @GetTopicsReq()
  async topics(@QueryLimit() limit?: number, @QuerySkip() skip?: number) {
    return this.TopicsService.topics({ limit, skip });
  }
}
