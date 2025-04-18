import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ThreadReq } from '@/dtos/thread-req.dto';

import { ThreadSchemaDocument } from '../schemas/thread.schema';

export type ThreadFilter = { limit?: number; skip?: number };

@Injectable()
export class ThreadRepository {
  constructor(
    @InjectModel(ThreadSchemaDocument.name)
    private readonly threadModel: Model<ThreadSchemaDocument>,
  ) {}

  async insertOne(req: ThreadReq) {
    await this.threadModel.insertOne(req);
  }

  async findAll(topicId: string, filter?: ThreadFilter) {
    return this.threadModel
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
