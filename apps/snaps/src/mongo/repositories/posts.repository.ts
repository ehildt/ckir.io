import { PostsReq } from '@ckir.io/dtos';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { hashPayload } from '@/helpers/hash-payload.helper';
import { PostsSchemaDocument } from '@/mongo/schemas/posts.schema';

export type PostsFilter = {
  limit?: number;
  skip?: number;
  select?: Record<string, number>;
};

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(PostsSchemaDocument.name)
    private readonly postsModel: Model<PostsSchemaDocument>,
  ) {}

  async insertOne(req: PostsReq) {
    const hash = hashPayload(req);
    return this.postsModel.insertOne({ ...req, hash });
  }

  async findByHash(hash: string) {
    return this.postsModel.findOne().where({ hash }).select({ __v: 0 }).lean().exec();
  }

  async findById(id: string) {
    return this.postsModel.findById(id).select({ __v: 0 }).lean().exec();
  }

  async findAll(threadId: string, filter?: PostsFilter) {
    return this.postsModel
      .find()
      .where({ threadId })
      .limit(filter?.limit)
      .skip(filter?.skip)
      .sort({ updatedAt: 'desc', createdAt: 'desc' })
      .select(
        Object.keys(filter.select)
          .filter((key) => !filter.select[key])
          .reduce((obj, key) => Object.assign(obj, { [key]: filter.select[key] }), { __v: 0 }),
      )
      .lean()
      .exec();
  }

  async findAllAttachments(postId: string, threadId: string, filter?: PostsFilter) {
    return this.postsModel
      .findById(postId)
      .where({ threadId })
      .limit(filter?.limit)
      .skip(filter?.skip)
      .sort({ updatedAt: 'desc', createdAt: 'desc' })
      .select({ attachments: 1 })
      .lean()
      .exec();
  }
}
