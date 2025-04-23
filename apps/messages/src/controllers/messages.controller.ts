import { MessageReq } from '@ckir.io/dtos';
import { Body, Controller, ParseEnumPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { GatewayMode } from '@/constants/gateway-mode.constants';
import { PostMessageReq } from '@/decorators/messages.decorators';
import { MessagesService } from '@/services/messages.service';

@ApiTags('Messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messageService: MessagesService) {}

  @PostMessageReq()
  async emit(
    @Body() message: MessageReq,
    @Query('mode', new ParseEnumPipe(GatewayMode, { optional: true }))
    gateway?: GatewayMode,
  ) {
    return this.messageService.emit(message, gateway);
  }
}
