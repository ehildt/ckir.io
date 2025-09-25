import { PostsReq } from '@ckir.io/dtos';
import { Body, Controller, Get } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

import {
  ApiGetPostsAttachmentsReq,
  ApiGetPostsReq,
  ApiPostInsertOne,
  QueryHash,
  QueryLimit,
  QueryPostId,
  QuerySelectAttachments,
  QuerySelectEmojis,
  QuerySelectFlags,
  QuerySkip,
  QueryThreadId,
} from '@/decorators/posts.decorator';
import { PostsService } from '@/services/posts.service';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiGetPostsReq()
  async posts(
    @QueryThreadId() threadId: string,
    @QueryLimit() limit?: number,
    @QuerySkip() skip?: number,
    @QuerySelectAttachments() attachments?: boolean,
    @QuerySelectEmojis() emojis?: boolean,
    @QuerySelectFlags() flags?: boolean,
  ) {
    return this.postsService.posts(threadId, {
      limit,
      skip,
      select: {
        attachments: Number(attachments),
        emojis: Number(emojis),
        flags: Number(flags),
      },
    });
  }

  @ApiGetPostsAttachmentsReq()
  async attachments(
    @QueryPostId() postId: string,
    @QueryThreadId() threadId: string,
    @QueryLimit() limit?: number,
    @QuerySkip() skip?: number,
  ) {
    return this.postsService.attachments(postId, threadId, {
      limit,
      skip,
    });
  }

  @ApiPostInsertOne()
  async insertOne(@Body() body: PostsReq) {
    return this.postsService.insertOne(body);
  }

  @Get(':hash')
  @ApiQuery({ name: 'hash', type: String })
  async findByHash(@QueryHash() hash: string) {
    return this.postsService.findByHash(hash);
  }
}
