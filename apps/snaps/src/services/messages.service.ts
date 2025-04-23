import { Injectable } from '@nestjs/common';

import { MessageFilter, MessageRepository } from '@/mongo/repositories/message.repository';

@Injectable()
export class MessagesService {
  constructor(private readonly messageRepository: MessageRepository) {}

  async messages(threadId: string, filter?: MessageFilter) {
    return this.messageRepository.findAll(threadId, filter);
  }

  async attachments(messageId: string, threadId: string, filter?: MessageFilter) {
    return (await this.messageRepository.findAllAttachments(messageId, threadId, filter)).attachments;
  }

  async insertOne(body: any): Promise<string> {
    return (await this.messageRepository.insertOne(body))?.id;
  }
}
