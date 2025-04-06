import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';

import { MessageAttachmentReq } from '@/archive/dtos/message-attachment.dto';
import { MessageReq } from '@/archive/dtos/message-req.dto';
import { AttachmentSchemaDocument } from '@/mongo/schemas/attachment.schema';
import { MessageSchemaDocument } from '@/mongo/schemas/message.schema';
import { ThreadSchemaDocument } from '@/mongo/schemas/thread.schema';
import { TopicSchemaDocument } from '@/mongo/schemas/topic.schema';

export type MessageFilter = { limit?: number; skip?: number; populate?: string };

@Injectable()
export class MessageRepository {
  constructor(
    @InjectModel(MessageSchemaDocument.name)
    private readonly messageModel: Model<MessageSchemaDocument>,
    @InjectModel(TopicSchemaDocument.name)
    private readonly topicModel: Model<TopicSchemaDocument>,
    @InjectModel(ThreadSchemaDocument.name)
    private readonly threadModel: Model<ThreadSchemaDocument>,
    @InjectModel(AttachmentSchemaDocument.name)
    private readonly attachmentModel: Model<AttachmentSchemaDocument>,
  ) {}

  async insert(req: MessageReq) {
    const session = await this.messageModel.startSession();
    try {
      await session.withTransaction(async () => {
        await this.messageModel.insertOne(
          {
            ...req,
            attachments: await this.insertAttachments(req.attachments, session),
          },
          { session },
        );
      });
      await session.commitTransaction();
    } catch (error) {
      console.error('Insert failed', error);
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async insertAttachments(attachments: Array<MessageAttachmentReq>, session?: ClientSession) {
    if (!attachments?.length) return [];
    return (await this.attachmentModel.insertMany(attachments, { session }))?.map(({ id }) => id);
  }

  // have the populate as an enum on the filter?
  async findAll(filter?: MessageFilter) {
    const t = await this.messageModel
      .find()
      .limit(filter?.limit)
      .skip(filter?.skip)
      .populate(filter?.populate)
      .sort({ updatedAt: 'desc', createdAt: 'desc' })
      .lean();

    return t;
  }

  // have the populate as an enum on the filter?
  async findAllAttachments(filter?: MessageFilter) {
    const t = await this.attachmentModel
      .find()
      .limit(filter?.limit)
      .skip(filter?.skip)
      .sort({ updatedAt: 'desc', createdAt: 'desc' })
      .lean();

    return t;
  }

  async count() {
    return await this.messageModel.estimatedDocumentCount({ lean: true });
  }
}
