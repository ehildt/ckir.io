import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { Job, JobState } from 'bullmq';
import { Logger } from 'pino';
import { format } from 'util';

import { PINO_LOGGER } from './bullmq-logger.constants';

const MSG_TEMPLATE = '✨ %s 🆔 ID-%s 🔂 Attempts-%d %s %s';

@Injectable()
export class BullMQLoggerService implements LoggerService {
  constructor(@Inject(PINO_LOGGER) private readonly logger: Logger) {}

  async log<T = any>(job: Job<T>) {
    const state = await job.getState();
    this.logger.info({
      msg: format(MSG_TEMPLATE, job.name, job.id, job.attemptsMade, this.getStateIcon(state), state),
    });
  }

  async error<T = any>(job: Job<T>) {
    const state = await job.getState();
    this.logger.error({
      msg: format(MSG_TEMPLATE, job.name, job.id, job.attemptsMade, this.getStateIcon(state), state),
      failedReason: state === 'failed' ? job.failedReason : undefined,
      stacktrace: state === 'failed' ? job.stacktrace : undefined,
    });
  }

  async warn<T = any>(job: Job<T>) {
    const state = await job.getState();
    this.logger.warn({
      msg: format(MSG_TEMPLATE, job.name, job.id, job.attemptsMade, this.getStateIcon(state), state),
      queue: job.queueName,
      maxAttempts: job.opts?.attempts,
      delay: job.opts?.delay,
      timestamp: job.timestamp,
      processedOn: job.processedOn,
      finishedOn: job.finishedOn,
    });
  }

  async debug<T = any>(job: Job<T>) {
    const state = await job.getState();
    this.logger.debug({
      msg: format(MSG_TEMPLATE, job.name, job.id, job.attemptsMade, this.getStateIcon(state), state),
      queue: job.queueName,
      timestamp: job.timestamp,
      opts: job.opts,
      data: job.data,
    });
  }

  async verbose<T = any>(job: Job<T>) {
    const state = await job.getState();
    this.logger.trace({
      msg: format(MSG_TEMPLATE, job.name, job.id, job.attemptsMade, this.getStateIcon(state), state),
      job,
    });
  }

  private getStateIcon(state: JobState | unknown) {
    switch (state) {
      case 'completed':
        return '🟢';
      case 'failed':
        return '🔴';
      case 'delayed':
        return '🟠';
      case 'waiting':
        return '🟡';
      case 'prioritized':
        return '🔵';
      case 'active':
        return '🟣';
      case 'waiting-children':
        return '🧩';
      default:
        return '⚪';
    }
  }
}
