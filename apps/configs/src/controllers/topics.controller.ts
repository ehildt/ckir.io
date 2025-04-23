import { Body, Controller, ParseEnumPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { GatewayMode } from '../constants/gateway-mode.constants';

import { PostTopicsReq } from '@/decorators/topics.decorators';
import { TopicReq } from '@/dtos/topic-req.dto';
import { TopicsService } from '@/services/topics.service';

@ApiTags('MSG Gateway')
@Controller('gateway')
export class TopicsController {
  constructor(private readonly topicService: TopicsService) {}

  @PostTopicsReq()
  async emit(
    @Body() topic: TopicReq,
    @Query('gateway', new ParseEnumPipe(GatewayMode, { optional: true }))
    gateway?: GatewayMode,
  ) {
    await this.topicService.emit(topic, gateway);
  }
}
