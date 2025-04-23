import { Injectable } from '@nestjs/common';

import { ThreadFilter, ThreadRepository } from '@/mongo/repositories/thread.repository';

@Injectable()
export class ThreadsService {
  constructor(private readonly threadRepository: ThreadRepository) {}

  async threads(topicId: string, filter?: ThreadFilter) {
    return this.threadRepository.findAll(topicId, filter);
  }

  async insertOne(body: any): Promise<string> {
    return (await this.threadRepository.insertOne(body))?.id;
  }
}
