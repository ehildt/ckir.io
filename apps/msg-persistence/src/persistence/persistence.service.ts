import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Queue } from 'bullmq';

import { BULLMQ_CHAT_QUEUE } from '@/constants/bullmq.constants';
import { MessageMode } from '@/constants/message.constants';
import { MessageReq } from '@/dtos/message-req.dto';
import { MongoService } from '@/mongo/services/mongo.service';

@Injectable()
export class PersistenceService {
  constructor(
    private readonly mongo: MongoService,
    @InjectQueue(BULLMQ_CHAT_QUEUE.PERSIST) private readonly messageQueue: Queue,
  ) {}

  async publish(req: MessageReq) {
    if (req.mode === MessageMode.PERSIST) await this.messageQueue.add(BULLMQ_CHAT_QUEUE.PERSIST, req);
    throw new UnprocessableEntityException();
  }

  async messages() {
    return this.mongo.messages();
  }

  async attachments() {
    return this.mongo.attachments();
  }
}
