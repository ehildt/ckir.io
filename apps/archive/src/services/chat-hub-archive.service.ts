import { Injectable, Logger } from '@nestjs/common';

import { Message } from '@/dtos/message.dto';
import { MessageRepository } from '@/repositories/message.repository';

@Injectable()
export class ChatArchiveService {
  constructor(
    private readonly logger: Logger,
    private readonly messageRepository: MessageRepository,
  ) {}

  async messages() {
    return this.messageRepository.findAll();
  }

  async insert(reqs: Array<Message>) {
    return this.messageRepository.insert(reqs);
  }

  async log(req: Message) {
    this.logger.log('Processing job:', JSON.stringify(req, null, 4), this.constructor.name);
  }
}
