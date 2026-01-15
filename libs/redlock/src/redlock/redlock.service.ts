import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import Redlock, { Lock, Settings } from 'redlock';

import { REDLOCK } from './redlock.constants';

@Injectable()
export class RedlockService implements OnModuleDestroy {
  constructor(@Inject(REDLOCK) private readonly _redlock: Redlock) {}

  acquire(resources: string[], duration: number, settings?: Partial<Settings>) {
    return this._redlock.acquire(resources, duration, settings);
  }

  release(lock: Lock, settings?: Partial<Settings>) {
    return this._redlock.release(lock, settings);
  }

  extend(existingLock: Lock, duration: number, settings?: Partial<Settings>) {
    return this._redlock.extend(existingLock, duration, settings);
  }

  get redlock() {
    return this._redlock;
  }

  async onModuleDestroy() {
    await this._redlock.quit();
  }
}
