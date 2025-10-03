import pino from 'pino';

export function BullMQPinoAdapter(): pino.LoggerOptions {
  return {
    level: process.env.BULLMQ_PINO_LOG_LEVEL ?? 'info',
    base: undefined,
    timestamp: pino.stdTimeFunctions.isoTime,
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'yyyy-mm-dd HH:MM:ss.l',
        colorize: true,
        ignore: 'pid,hostname',
      },
    },
  };
}
