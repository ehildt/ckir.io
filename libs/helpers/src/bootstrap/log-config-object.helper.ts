import { Logger } from '@nestjs/common';

export function logConfigObject(logger: Logger, factory: any) {
  if (process.env.PRINT_CONFIG === 'true')
    logger.log(
      Object.keys(factory).reduce(
        (obj, key) => Object.assign(obj, { [key.slice(1)]: factory[key] }),
        {},
      ),
    );
}
