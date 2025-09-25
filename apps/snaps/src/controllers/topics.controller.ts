import { TopicsReq } from '@ckir.io/dtos';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiGetTopicsReq, QueryHash, QueryLimit, QuerySkip } from '@/decorators/topics.decorators';
import { TopicsService } from '@/services/topics.service';

@ApiTags('Topics')
@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @ApiGetTopicsReq()
  async topics(@QueryLimit() limit?: number, @QuerySkip() skip?: number) {
    return this.topicsService.topics({ limit, skip });
  }

  @Post()
  @ApiBody({
    type: TopicsReq,
    required: true,
  })
  @ApiResponse({
    type: String,
  })
  async insertOne(@Body() body: TopicsReq) {
    return this.topicsService.insertOne(body);
  }

  @Get(':hash')
  @ApiQuery({ name: 'hash', type: String })
  async findByHash(@QueryHash() hash: string) {
    return this.topicsService.findByHash(hash);
  }
}
