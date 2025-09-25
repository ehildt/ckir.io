import { TopicsReq } from '@ckir.io/dtos';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { hashPayload } from '@/helpers/hash-payload.helper';
import { TopicsSchemaDocument } from '@/mongo/schemas/topics.schema';

export type TopicsFilter = { limit?: number; skip?: number };

@Injectable()
export class TopicsRepository {
  constructor(
    @InjectModel(TopicsSchemaDocument.name)
    private readonly topicsModel: Model<TopicsSchemaDocument>,
  ) {}

  async insertOne(req: TopicsReq) {
    const hash = hashPayload(req);
    return this.topicsModel.insertOne({ ...req, hash });
  }

  async findByHash(hash: string) {
    return this.topicsModel.findOne().where({ hash }).select({ __v: 0 }).lean().exec();
  }

  async findAll(filter?: TopicsFilter) {
    return this.topicsModel
      .find()
      .limit(filter?.limit)
      .skip(filter?.skip)
      .sort({ updatedAt: 'desc', createdAt: 'desc' })
      .select({ __v: 0 })
      .lean()
      .exec();
  }

  async findById(id: string) {
    return this.topicsModel.findById(id).select({ __v: 0 }).lean().exec();
  }
}
