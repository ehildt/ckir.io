import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { MessageReq } from '@/dtos/message-req.dto';
import { MessageSchemaDocument } from '@/mongo/schemas/message.schema';

export type MessageFilter = {
  limit?: number;
  skip?: number;
  select?: Record<string, number>;
};

@Injectable()
export class MessageRepository {
  constructor(
    @InjectModel(MessageSchemaDocument.name)
    private readonly messageModel: Model<MessageSchemaDocument>,
  ) {}

  async insertOne(req: MessageReq) {
    return this.messageModel.insertOne(req);
  }

  async findAll(threadId: string, filter?: MessageFilter) {
    return this.messageModel
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

  async findAllAttachments(messageId: string, threadId: string, filter?: MessageFilter) {
    return this.messageModel
      .findById(messageId)
      .where({ threadId })
      .limit(filter?.limit)
      .skip(filter?.skip)
      .sort({ updatedAt: 'desc', createdAt: 'desc' })
      .select({ attachments: 1 })
      .lean()
      .exec();
  }
}
