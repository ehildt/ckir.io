import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';

export function MongoConfigAdapter(): MongooseModuleFactoryOptions {
  return {
    uri: process.env.MONGODB_CONNECTION_STRING,
  };
}
