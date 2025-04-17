import { Body, Controller, Get, Post, UnprocessableEntityException } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';

import { MessageMode } from '@/constants/message.constants';
import { MessageAttachmentReq } from '@/dtos/message-attachment.dto';
import { MessageReq } from '@/dtos/message-req.dto';

import { PersistenceService } from './persistence.service';

const REQUEST_SUCCESSFUL = 'Message emitted successfully';

@ApiTags('Persistence')
@Controller('persistence')
export class PersistenceController {
  constructor(private readonly persistenceService: PersistenceService) {}

  @Post()
  @ApiBody({ required: true, type: MessageReq })
  @ApiCreatedResponse({ description: REQUEST_SUCCESSFUL })
  async publish(@Body() req: MessageReq) {
    if (req.mode === MessageMode.PERSIST) await this.persistenceService.publish(req);
    throw new UnprocessableEntityException();
  }

  @Get()
  @ApiResponse({ description: REQUEST_SUCCESSFUL, type: MessageReq, isArray: true })
  async messages() {
    return this.persistenceService.messages();
  }

  @Get('attachments')
  @ApiResponse({ description: REQUEST_SUCCESSFUL, type: MessageAttachmentReq, isArray: true })
  async attachments() {
    return this.persistenceService.attachments();
  }
}
