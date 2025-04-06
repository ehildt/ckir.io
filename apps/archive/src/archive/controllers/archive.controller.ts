import { InjectQueue } from '@nestjs/bullmq';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Queue } from 'bullmq';

import {
  OpenApi_GetChatMessageAttachments,
  OpenApi_GetChatMessages,
  OpenApi_UpsertChatMessage,
} from '@/archive/decorators/open-api.decorators';
import { MongoService } from '@/mongo/services/mongo.service';

import { BULLMQ_CHAT_QUEUE } from '../constants /bullmq.constants';
import { MessageMode } from '../constants /message-req.constants';
import { MessageReq } from '../dtos/message-req.dto';

@ApiTags('Archive')
@Controller('messages')
export class ArchiveController {
  constructor(
    private readonly archive: MongoService,
    @InjectQueue(BULLMQ_CHAT_QUEUE.PERSIST) private readonly messageQueue: Queue,
  ) {}

  @Post()
  @OpenApi_UpsertChatMessage()
  async publish(@Body() req: MessageReq) {
    if (req.mode === MessageMode.PERSIST || req.mode === MessageMode.VECTORIZE)
      await this.messageQueue.add(BULLMQ_CHAT_QUEUE.PERSIST, req);
  }

  @Get()
  @OpenApi_GetChatMessages()
  async messages() {
    return this.archive.messages();
  }

  @Get('attachments')
  @OpenApi_GetChatMessageAttachments()
  async attachments() {
    return this.archive.attachments();
  }
}
