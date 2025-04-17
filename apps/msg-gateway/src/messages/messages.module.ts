import { Logger, Module } from '@nestjs/common';

import { BullMQProcessorsModule } from '@/bullmq-processors/bullmq-processors.module';

import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

@Module({
  imports: [BullMQProcessorsModule],
  controllers: [MessagesController],
  providers: [Logger, MessagesService],
})
export class MessagesModule {}
