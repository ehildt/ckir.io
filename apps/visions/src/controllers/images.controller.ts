import { OllamaService } from '@ckir.io/ollama';
import { Controller, Post, Req } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';

import { OllamaConfigService } from '@/configs/ollama-config.service';
import { ApiBodyFileMultipart } from '@/decorators/visions.decorator';
import { getFastifyMultipartDataWithFilters } from '@/helpers/get-fastify-multipart-data.helper';

type Prompt = { role: string; content: string; images?: any };

@ApiTags('Images')
@Controller('images')
export class ImagesController {
  constructor(
    private readonly ollamaService: OllamaService,
    private readonly ollamaConfigService: OllamaConfigService,
  ) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBodyFileMultipart()
  async describeImages(@Req() req: FastifyRequest) {
    const { buffers, meta, filters } =
      await getFastifyMultipartDataWithFilters(req);

    const prompts: Array<Prompt> = [];

    if (filters.prompt)
      prompts.push({
        role: 'user',
        content: filters.prompt,
      });

    if (filters.focus) {
      prompts.push({
        role: 'assistant',
        content: 'Focus only on the main subject',
      });
    }

    // ! REFINE: to be removed or delegated to another model
    if (filters.sharedContext) {
      prompts.push({
        role: 'assistant',
        content: `These images belong to the same subject, scene, or context. 
        Rather than describing them individually, generate a single, comprehensive 
        description encompassing the entire set.`,
      });
    }

    const reply = await this.ollamaService.chat({
      stream: filters.stream,
      keep_alive: this.ollamaConfigService.xOllamaConfig.keepAlive,
      model: this.ollamaConfigService.xOllamaConfig.x_options.visionModel,
      messages: [
        {
          role: 'assistant',
          content: `You are a vision-to-text model: for each image, provide detailed, 
          objective descriptions including visible text, typography, interface elements, layout, 
          composition, spatial relationships, language, and contextual information; 
          the images may depict the same subject, scene, or share similar content; 
          include only explicitly visible information unless the user requests otherwise; 
          output strictly factual descriptions without opinions, explanations, or extra commentary.
          ${meta.map((meta) => meta.filename)}`,
          images: buffers,
        },
        ...prompts,
      ],
    });

    return reply;
  }
}
