import {
  BULLMQ_JOB,
  BULLMQ_QUEUE,
  BullMQPinoLoggerService,
} from '@ehildt/ckir-bullmq';
import { OllamaService } from '@ehildt/ckir-ollama';
import { SocketIOService } from '@ehildt/ckir-socket-io';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Message } from 'ollama';

import { OllamaConfigService } from '@/configs/ollama-config.service';
import { ANALYZE_VISIONS } from '@/constants/analyze-visions.tool';
import { CREATE_EMBEDDINGS } from '@/constants/create-embeddings.tool';
import { SYSTEM_PROMPT } from '@/constants/system.prompt';
import { FastifyMultipartDataWithFilters } from '@/helpers/get-fastify-multipart-data.helper';

// hard ceiling agent calls
// ! put it into configs
const MAX_STEPS = 10;

@Processor(BULLMQ_QUEUE.BROADCAST_TOOL)
export class ToolsProcessor extends WorkerHost {
  constructor(
    private readonly io: SocketIOService,
    private readonly ollamaService: OllamaService,
    private readonly ollamaConfigService: OllamaConfigService,
    private readonly bullMQLogger: BullMQPinoLoggerService,
  ) {
    super();
  }

  async process(job: Job<FastifyMultipartDataWithFilters>) {
    if (!job.data.filters.roomId) throw new Error('Missing roomId');
    if (job.name !== BULLMQ_JOB.DISPATCH)
      throw new Error('Unexpected job name');

    const messages: Array<Message> = [SYSTEM_PROMPT];

    messages.push({
      role: 'user',
      content: JSON.stringify({
        prompt: job.data.filters.prompt,
        parameters: job.data.filters,
        files: job.data.meta,
      }),
    });

    for (let step = 0; step < MAX_STEPS; step++) {
      const message = await this.chatMessage(job, messages);
      // we remember the tools the model decided to call
      messages.push(message);
      const toolCalls = message.tool_calls ?? [];

      // if there are no more tools to call in message
      // we return the response as a stream.
      if (!toolCalls.length) {
        console.log(JSON.stringify(message, null, 2));
        break;
      }

      // Return a tool result per tool call
      // stream set to false
      for (const call of toolCalls) {
        const toolName = call.function?.name;

        // we wanna call each tool
        if (toolName === 'create_embedding') {
          console.log('CALLING:', JSON.stringify(call, null, 2));

          try {
            const reply = await (
              await fetch('http://vectors:3004/api/v1/mcp/vectors/embeddings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: call.function.arguments.content }),
              })
            ).json();

            messages.push({
              role: 'tool',
              tool_name: toolName,
              content: `embeddings created using model: ${JSON.stringify(reply)}`,
            });
          } catch (error) {
            console.error(error);
          }
        }
      }
    }
  }

  private async chatMessage(
    job: Job<FastifyMultipartDataWithFilters>,
    messages?: Array<Message>,
  ) {
    return (
      await this.ollamaService.chat({
        messages,
        stream: false,
        options: { num_ctx: 8192 },
        model: job.data.filters.aiLLM,
        tools: [ANALYZE_VISIONS, CREATE_EMBEDDINGS],
        keep_alive: this.ollamaConfigService.config.keepAlive,
      })
    )?.message;
  }

  @OnWorkerEvent('completed')
  async onCompleted(job: Job) {
    await this.bullMQLogger.log(job);
  }

  @OnWorkerEvent('error')
  async onError(job: Job) {
    await this.bullMQLogger.log(job);
  }

  @OnWorkerEvent('active')
  async onActive(job: Job) {
    await this.bullMQLogger.log(job);
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job) {
    await this.bullMQLogger.error(job);
  }
}
