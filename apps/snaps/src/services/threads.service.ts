import { Injectable } from '@nestjs/common';

import { ThreadFilter, ThreadsRepository } from '@/mongo/repositories/threads.repository';

@Injectable()
export class ThreadsService {
  constructor(private readonly threadRepository: ThreadsRepository) {}

  async threads(topicId: string, filter?: ThreadFilter) {
    return this.threadRepository.findAll(topicId, filter);
  }

  async insertOne(body: any): Promise<string> {
    return (await this.threadRepository.insertOne(body))?.id;
  }

  async findByHash(hash: string) {
    return await this.threadRepository.findByHash(hash);
  }
}
