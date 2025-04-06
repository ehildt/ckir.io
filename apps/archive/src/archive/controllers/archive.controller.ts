import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import {
  OpenApi_GetChatMessages,
  OpenApi_UpsertChatMessage,
} from '@/archive/decorators/open-api.controller.decorators';
import { MongoService } from '@/mongo/services/mongo.service';

import { ChatMessageReq } from '../dtos/chat-message.dto.req';

@ApiTags('Archive')
@Controller('messages')
export class ArchiveController {
  constructor(private readonly archive: MongoService) {}

  @Post()
  @OpenApi_UpsertChatMessage()
  async publish(@Body() req: ChatMessageReq) {
    // ! use bullmq to put the message into the persist queue
    // return this.archive.insert(reqs);
  }

  @Get()
  @OpenApi_GetChatMessages()
  async messages() {
    return this.archive.messages();
  }
}
