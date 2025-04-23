import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { TopicReq } from '@/dtos/topic-req.dto';
import { TopicSchemaDocument } from '@/mongo/schemas/topic.schema';

export type TopicFilter = { limit?: number; skip?: number };

@Injectable()
export class TopicRepository {
  constructor(
    @InjectModel(TopicSchemaDocument.name)
    private readonly topicModel: Model<TopicSchemaDocument>,
  ) {}

  async insertOne(req: TopicReq) {
    return this.topicModel.insertOne(req);
  }

  async findAll(filter?: TopicFilter) {
    return this.topicModel
      .find()
      .limit(filter?.limit)
      .skip(filter?.skip)
      .sort({ updatedAt: 'desc', createdAt: 'desc' })
      .select({ __v: 0 })
      .lean()
      .exec();
  }
}
