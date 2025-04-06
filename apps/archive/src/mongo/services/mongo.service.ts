import { Injectable, Logger } from '@nestjs/common';

import { ChatMessageReq } from '@/archive/dtos/chat-message.dto.req';
import { MessageRepository } from '@/mongo/repositories/message.repository';

@Injectable()
export class MongoService {
  constructor(
    private readonly logger: Logger,
    private readonly messageRepository: MessageRepository,
  ) {}

  async messages() {
    return this.messageRepository.findAll();
  }

  async insert(req: ChatMessageReq) {
    return this.messageRepository.insert(req);
  }
}
