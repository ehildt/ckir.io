import { TopicReq } from '@ckir.io/dtos';
import { Body, Controller, ParseEnumPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { GatewayMode } from '../constants/gateway-mode.constants';

import { PostTopicsReq } from '@/decorators/topics.decorators';
import { TopicsService } from '@/services/topics.service';

@ApiTags('Topics')
@Controller('topics')
export class TopicsController {
  constructor(private readonly topicService: TopicsService) {}

  @PostTopicsReq()
  async emit(
    @Body() topic: TopicReq,
    @Query('mode', new ParseEnumPipe(GatewayMode, { optional: true }))
    mode?: GatewayMode,
  ) {
    await this.topicService.emit(topic, mode);
  }
}
