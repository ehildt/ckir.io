import { PostsReq } from '@ckir.io/dtos';
import { Body, Controller, ParseEnumPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PostsMode } from '@/constants/posts-mode.constants';
import { ApiPostsReq } from '@/decorators/posts.decorators';
import { PostsService } from '@/services/posts.service';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiPostsReq()
  async emit(
    @Body() message: PostsReq,
    @Query('mode', new ParseEnumPipe(PostsMode, { optional: true }))
    gateway?: PostsMode,
  ) {
    return this.postsService.emit(message, gateway);
  }
}
