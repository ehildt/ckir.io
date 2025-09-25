import { ApiHideProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { TopicsReq } from './topics-req.dto';

export class TopicsRes extends TopicsReq {
  @IsString()
  @ApiHideProperty()
  hash: string;
}
