import { Injectable } from '@nestjs/common';

import {
  TopicsFilter,
  TopicsRepository,
} from '../mongo/repositories/topic.repository';

@Injectable()
export class TopicsService {
  constructor(private readonly topicRepository: TopicsRepository) {}

  async topics(filter?: TopicsFilter) {
    return this.topicRepository.findAll(filter);
  }

  async insertIfNotExists(body: any): Promise<string> {
    return (
      await this.topicRepository.insertIfNotExists(body)
    )?._id?.toString();
  }

  async findByHash(hash: string) {
    return await this.topicRepository.findByHash(hash);
  }

  async findById(id: string) {
    return await this.topicRepository.findById(id);
  }
}
