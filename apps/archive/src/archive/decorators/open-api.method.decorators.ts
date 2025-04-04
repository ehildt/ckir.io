import { ApiBody } from '@nestjs/swagger';

import { Message } from '@/archive/dtos/message.dto';

export const MessageUpsert = () =>
  ApiBody({
    isArray: true,
    required: true,
    type: Message,
  });
