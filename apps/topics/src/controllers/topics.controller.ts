import { ProcessingMode, TopicsReq } from '@ehildt/ckir-dtos';
import { Body, Controller, ParseEnumPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PostTopicsReq } from '@/decorators/topics.decorators';
import { TopicsService } from '@/services/topics.service';

@ApiTags('Topics')
@Controller('topics')
export class TopicsController {
  constructor(private readonly topicService: TopicsService) {}

  @PostTopicsReq()
  async emit(
    @Body() topic: TopicsReq,
    @Query('mode', new ParseEnumPipe(ProcessingMode, { optional: true }))
    mode?: ProcessingMode,
  ) {
    await this.topicService.emit(topic, mode);
  }
}
