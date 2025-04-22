import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import {
  GetMessageAttachmentsReq,
  GetMessagesReq,
  QueryLimit,
  QueryMessageId,
  QuerySelectAttachments,
  QuerySelectEmojis,
  QuerySelectFlags,
  QuerySkip,
  QueryThreadId,
} from '@/decorators/messages.decorator';
import { MessagesService } from '@/services/messages.service';

@ApiTags('Messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @GetMessagesReq()
  async messages(
    @QueryThreadId() threadId: string,
    @QueryLimit() limit?: number,
    @QuerySkip() skip?: number,
    @QuerySelectAttachments() attachments?: boolean,
    @QuerySelectEmojis() emojis?: boolean,
    @QuerySelectFlags() flags?: boolean,
  ) {
    return this.messagesService.messages(threadId, {
      limit,
      skip,
      select: {
        attachments: Number(attachments),
        emojis: Number(emojis),
        flags: Number(flags),
      },
    });
  }

  @GetMessageAttachmentsReq()
  async attachments(
    @QueryMessageId() messageId: string,
    @QueryThreadId() threadId: string,
    @QueryLimit() limit?: number,
    @QuerySkip() skip?: number,
  ) {
    return this.messagesService.attachments(messageId, threadId, { limit, skip });
  }
}
