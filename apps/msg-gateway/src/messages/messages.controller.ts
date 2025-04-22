import { Body, Controller, HttpCode, HttpStatus, ParseEnumPipe, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { MessageReq } from '@/dtos/message-req.dto';

import { GatewayMode } from '../constants/gateway-mode.constants';
import { MessagesService } from './messages.service';

const REQUEST_SUCCESSFUL = 'Message emitted successfully';

@ApiTags('Gateway')
@Controller('gateway')
export class MessagesController {
  constructor(private readonly chatService: MessagesService) {}

  @Post()
  @HttpCode(202)
  @ApiQuery({ name: 'gateway', enum: GatewayMode, required: false })
  @ApiBody({ required: true, type: MessageReq })
  @ApiResponse({ description: REQUEST_SUCCESSFUL, status: HttpStatus.ACCEPTED })
  @ApiOperation({
    description: `
          Handles chat messages by emitting them in real-time and optionally queueing them for persistence and vectorization. 
          Messages can be stored for future retrieval or processed for AI-based analysis using BullMQ.`,
  })
  async emit(
    @Body() message: MessageReq,
    @Query('gateway', new ParseEnumPipe(GatewayMode, { optional: true })) gateway?: GatewayMode,
  ) {
    return this.chatService.emit(message, gateway);
  }
}
