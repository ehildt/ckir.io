import { TopicsReq } from '@ckir.io/dtos';
import { Body, Controller, ParseEnumPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { TopicsMode } from '../constants/topics-mode.constants';

import { PostTopicsReq } from '@/decorators/topics.decorators';
import { TopicsService } from '@/services/topics.service';

@ApiTags('Topics')
@Controller('topics')
export class TopicsController {
  constructor(private readonly topicService: TopicsService) {}

  @PostTopicsReq()
  async emit(
    @Body() topic: TopicsReq,
    @Query('mode', new ParseEnumPipe(TopicsMode, { optional: true }))
    mode?: TopicsMode,
  ) {
    await this.topicService.emit(topic, mode);
  }
}
