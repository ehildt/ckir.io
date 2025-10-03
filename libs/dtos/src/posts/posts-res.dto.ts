import { IsString } from 'class-validator';

import { PostsReq } from './posts-req.dto';

export class PostsRes extends PostsReq {
  @IsString()
  hash: string;
}
