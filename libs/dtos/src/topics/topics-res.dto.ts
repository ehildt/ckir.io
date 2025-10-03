import { IsString } from 'class-validator';

import { TopicsReq } from './topics-req.dto';

export class TopicsRes extends TopicsReq {
  @IsString()
  hash: string;
}
