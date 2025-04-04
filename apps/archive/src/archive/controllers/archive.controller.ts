import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ChatUpsertBody } from '@/archive/decorators/controller.parameter.decorators';
import { OpenApi_Chat, OpenApi_Messages } from '@/archive/decorators/open-api.controller.decorators';
import { Message } from '@/archive/dtos/message.dto';
import { MongoService } from '@/mongo/services/mongo.service';

@ApiTags('Archive')
@Controller('messages')
export class ArchiveController {
  constructor(private readonly archive: MongoService) {}

  @Post()
  @OpenApi_Chat()
  async publish(@ChatUpsertBody() reqs: Array<Message>) {
    return this.archive.insert(reqs);
  }

  @Get()
  @OpenApi_Messages()
  async messages() {
    return this.archive.messages();
  }
}
