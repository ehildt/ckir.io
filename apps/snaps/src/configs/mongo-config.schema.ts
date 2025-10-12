import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import Joi from 'joi';

export const MongoConfigSchema = Joi.object<MongooseModuleFactoryOptions>({
  uri: Joi.string().required(),
});
