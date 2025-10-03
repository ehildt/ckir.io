import { ThreadsReq, ThreadsRes } from '@ckir.io/dtos';
import { hashPayload } from '@ckir.io/helpers';
import { ConflictException, Injectable } from '@nestjs/common';
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
    const id = (await this.findByHash(hash))?._id;
    if (!id) return this.threadsModel.insertOne<ThreadsRes>({ ...req, hash });
    throw new ConflictException(`Thread ${req.title} already exists ${id}`);
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
