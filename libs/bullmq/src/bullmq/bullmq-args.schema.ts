import Joi from 'joi';

import { BullMQArgs } from '../bullmq/bullmq.model';

export const BullMQArgsSchema = Joi.object<BullMQArgs>({
  jobPersist: Joi.string().min(1).optional(),
  jobDispatch: Joi.string().min(1).optional(),
  jobVectorize: Joi.string().min(1).optional(),
  queuePersistTopic: Joi.string().min(1).optional(),
  queueBroadcastTopic: Joi.string().min(1).optional(),
  queueVectorizeTopic: Joi.string().min(1).optional(),
});
