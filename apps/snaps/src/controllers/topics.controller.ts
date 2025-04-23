import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetTopicsReq, QueryLimit, QuerySkip } from '@/decorators/topics.decorators';
import { TopicReq } from '@/dtos/topic-req.dto';
import { TopicsService } from '@/services/topics.service';

@ApiTags('Topics')
@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @GetTopicsReq()
  async topics(@QueryLimit() limit?: number, @QuerySkip() skip?: number) {
    return this.topicsService.topics({ limit, skip });
  }

  @Post()
  @ApiBody({
    type: TopicReq,
    required: true,
  })
  @ApiResponse({
    type: String,
  })
  async insertOne(@Body() body: TopicReq) {
    return this.topicsService.insertOne(body);
  }
}
