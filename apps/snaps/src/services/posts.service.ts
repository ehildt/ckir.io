import { Injectable } from '@nestjs/common';

import { PostsFilter, PostsRepository } from '@/mongo/repositories/posts.repository';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  async posts(threadId: string, filter?: PostsFilter) {
    return this.postsRepository.findAll(threadId, filter);
  }

  async attachments(postId: string, threadId: string, filter?: PostsFilter) {
    return (await this.postsRepository.findAllAttachments(postId, threadId, filter)).attachments;
  }

  async insertOne(body: any): Promise<string> {
    return (await this.postsRepository.insertOne(body))?.id;
  }

  async findByHash(hash: string) {
    return await this.postsRepository.findByHash(hash);
  }
}
