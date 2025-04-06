import { ApiBody } from '@nestjs/swagger';

import { ChatMessageReq } from '../dtos/chat-message.dto.req';

export const MessageUpsert = () =>
  ApiBody({
    required: true,
    type: ChatMessageReq,
  });
