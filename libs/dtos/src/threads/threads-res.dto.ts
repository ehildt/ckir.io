import { IsString } from 'class-validator';

import { ThreadsReq } from './threads-req.dto';

export class ThreadsRes extends ThreadsReq {
  @IsString()
  hash: string;
}
