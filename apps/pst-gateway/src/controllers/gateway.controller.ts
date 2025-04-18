import { Body, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { GatewayMode } from '@/constants/gateway-mode.constants';
import { MessageReq } from '@/dtos/message-req.dto';
import { ThreadReq } from '@/dtos/thread-req.dto';
import { TopicReq } from '@/dtos/topic-req.dto';
import { MessagesService } from '@/services/messages.service';
import { ThreadsService } from '@/services/threads.service';
import { TopicsService } from '@/services/topics.service';

import { PosThreadReq, PostMessageReq, PosTopicReq, QueryGatewayMode } from '../decorators/gateway.decorators';

@ApiTags('Gateway')
@Controller('gateway')
export class GatewayController {
  constructor(
    private readonly messageService: MessagesService,
    private readonly topicService: TopicsService,
    private readonly threadService: ThreadsService,
  ) {}

  @PostMessageReq()
  async publishMessage(@Body() req: MessageReq, @QueryGatewayMode() mode?: GatewayMode) {
    return this.messageService.insertOneQueued(req, mode);
  }

  @PosTopicReq()
  async publishTopic(@Body() req: TopicReq, @QueryGatewayMode() mode: GatewayMode) {
    return this.topicService.insertOneQueued(req, mode);
  }

  @PosThreadReq()
  async publishThread(@Body() req: ThreadReq, @QueryGatewayMode() mode: GatewayMode) {
    return this.threadService.insertOneQueued(req, mode);
  }
}
