import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ChatMessageReq } from '@/archive/dtos/chat-message.dto.req';
import { AttachmentSchemaDocument } from '@/mongo/schemas/attachment.schema';
import { EmojiSchemaDocument } from '@/mongo/schemas/emoji.schema';
import { FlagSchemaDocument } from '@/mongo/schemas/flag.schema';
import { MessageSchemaDocument } from '@/mongo/schemas/message.schema';
import { ParticipantSchemaDocument } from '@/mongo/schemas/participant.schema';
import { ThreadSchemaDocument } from '@/mongo/schemas/thread.schema';
import { TopicSchemaDocument } from '@/mongo/schemas/topic.schema';

import { ArgsSchemaDocument } from '../schemas/args.schema';

type Filter = { limit: number; skip: number };

@Injectable()
export class MessageRepository {
  constructor(
    @InjectModel(MessageSchemaDocument.name)
    private readonly messageModel: Model<MessageSchemaDocument>,
    @InjectModel(TopicSchemaDocument.name)
    private readonly topicModel: Model<TopicSchemaDocument>,
    @InjectModel(ThreadSchemaDocument.name)
    private readonly threadModel: Model<ThreadSchemaDocument>,
    @InjectModel(ParticipantSchemaDocument.name)
    private readonly participantModel: Model<ParticipantSchemaDocument>,
    @InjectModel(EmojiSchemaDocument.name)
    private readonly emojiModel: Model<EmojiSchemaDocument>,
    @InjectModel(FlagSchemaDocument.name)
    private readonly flagModel: Model<FlagSchemaDocument>,
    @InjectModel(AttachmentSchemaDocument.name)
    private readonly attachmentModel: Model<AttachmentSchemaDocument>,
    @InjectModel(ArgsSchemaDocument.name)
    private readonly argsModel: Model<ArgsSchemaDocument>,
  ) {}

  async insert(req: ChatMessageReq) {
    const session = await this.messageModel.startSession();
    try {
      await session.withTransaction(async () => {
        const topicRes = await this.topicModel.insertOne(req.topic, { session });
        const threadRes = await this.threadModel.insertOne(req.thread, { session });
        console.log({ topicRes, threadRes });
      });
    } catch (error) {
      console.error('Insert failed', error);
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async findAll(filter: Filter = { limit: 10, skip: 0 }) {
    return await this.messageModel
      .find(filter)
      .populate(['emojis', 'flags', 'topic', 'thread', 'attachments', 'participants', 'args'])
      .sort({ updatedAt: 'desc', createdAt: 'desc' })
      .lean();
  }

  async count() {
    return await this.messageModel.estimatedDocumentCount({ lean: true });
  }
}
