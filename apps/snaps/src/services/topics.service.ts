import { Injectable } from '@nestjs/common';

import { TopicFilter, TopicRepository } from '../mongo/repositories/topic.repository';

@Injectable()
export class TopicsService {
  constructor(private readonly topicRepository: TopicRepository) {}

  async topics(filter?: TopicFilter) {
    return this.topicRepository.findAll(filter);
  }

  async insertOne(body: any): Promise<string> {
    return (await this.topicRepository.insertOne(body))?.id;
  }
}
