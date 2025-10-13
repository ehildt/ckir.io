import { TopicsReq, TopicsRes } from '@ckir.io/dtos';
import { hashPayload } from '@ckir.io/helpers';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { TopicsSchemaDocument } from '@/mongo/schemas/topics.schema';

export type TopicsFilter = { limit?: number; skip?: number };

@Injectable()
export class TopicsRepository {
  constructor(
    @InjectModel(TopicsSchemaDocument.name)
    private readonly topicsModel: Model<TopicsSchemaDocument>,
  ) {}

  async insertIfNotExists(req: TopicsReq) {
    const hash = hashPayload(req?.title?.toLocaleLowerCase());
    const { _id, __v } = (await this.findByHash(hash)) ?? {};
    if (!_id) return this.topicsModel.insertOne<TopicsRes>({ ...req, hash });
    return { _id, __v };
  }

  async findByHash(hash: string) {
    return this.topicsModel
      .findOne()
      .where({ hash })
      .select({ __v: 0 })
      .lean()
      .exec();
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
