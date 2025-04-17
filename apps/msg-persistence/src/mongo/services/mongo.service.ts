import { Injectable, Logger } from '@nestjs/common';

import { MessageReq } from '@/dtos/message-req.dto';
import { MessageFilter, MessageRepository } from '@/mongo/repositories/message.repository';

@Injectable()
export class MongoService {
  constructor(
    private readonly logger: Logger,
    private readonly messageRepository: MessageRepository,
  ) {}

  async messages(filter?: MessageFilter) {
    return this.messageRepository.findAll(filter);
  }

  async attachments(filter?: MessageFilter) {
    return this.messageRepository.findAllAttachments(filter);
  }

  async insert(req: MessageReq) {
    return this.messageRepository.insert(req);
  }
}
