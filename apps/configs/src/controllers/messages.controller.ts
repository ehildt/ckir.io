import { Body, Controller, ParseEnumPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { GatewayMode } from '@/constants/gateway-mode.constants';
import { PostMessageReq } from '@/decorators/messages.decorators';
import { MessageReq } from '@/dtos/message-req.dto';
import { MessagesService } from '@/services/messages.service';

@ApiTags('MSG Gateway')
@Controller('gateway')
export class MessagesController {
  constructor(private readonly messageService: MessagesService) {}

  @PostMessageReq()
  async emit(
    @Body() message: MessageReq,
    @Query('gateway', new ParseEnumPipe(GatewayMode, { optional: true }))
    gateway?: GatewayMode,
  ) {
    return this.messageService.emit(message, gateway);
  }
}
