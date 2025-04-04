import { Body, ParseArrayPipe } from '@nestjs/common';

import { Message } from '@/archive/dtos/message.dto';

export const ChatUpsertBody = () => Body(new ParseArrayPipe({ items: Message }));
