import { ThreadsReq, ThreadsRes } from '@ehildt/ckir-dtos';
import { hashPayload } from '@ehildt/ckir-helpers';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ThreadsSchemaDocument } from '../schemas/threads.schema';

export type ThreadFilter = { limit?: number; skip?: number };

@Injectable()
export class ThreadsRepository {
  constructor(
    @InjectModel(ThreadsSchemaDocument.name)
    private readonly threadsModel: Model<ThreadsSchemaDocument>,
  ) {}

  async insertIfNotExists(req: ThreadsReq) {
    const hash = hashPayload(req?.title?.toLocaleLowerCase());
    const { _id, __v } = await this.findByHash(hash);
    if (!_id) return this.threadsModel.insertOne<ThreadsRes>({ ...req, hash });
    return { _id, __v };
  }

  async findByHash(hash: string) {
    return this.threadsModel
      .findOne()
      .where({ hash })
      .select({ __v: 0 })
      .lean()
      .exec();
  }

  async findById(id: string) {
    return this.threadsModel.findById(id).select({ __v: 0 }).lean().exec();
  }

  async findAll(topicId: string, filter?: ThreadFilter) {
    return this.threadsModel
      .find()
      .where(topicId)
      .limit(filter?.limit)
      .skip(filter?.skip)
      .sort({ updatedAt: 'desc', createdAt: 'desc' })
      .select({ __v: 0 })
      .lean()
      .exec();
  }
}
