import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { OpenApi_Chat } from '@/chat/decorators/open-api.controller.decorators';
import { ChatMessageReq } from '@/chat/dtos/chat-message.dto.req';
import { ChatService } from '@/chat/services/chat.service';

@ApiTags('Chat')
@Controller('messages')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @HttpCode(202)
  @Post()
  @OpenApi_Chat()
  async emit(@Body() message: ChatMessageReq) {
    return this.chatService.emit(message);
  }
}
