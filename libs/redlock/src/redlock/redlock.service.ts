import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import Redlock, { Lock, RedlockAbortSignal } from 'redlock';

import { REDLOCK, REDLOCK_DEFAULTS } from './redlock.constants';

@Injectable()
export class RedlockService implements OnModuleDestroy {
  private readonly _locks = new Map<string, Lock>();
  constructor(@Inject(REDLOCK) private readonly _redlock: Redlock) {}

  /**
   * Structured-concurrency API.
   * Lock lifecycle is fully managed by Redlock.
   * No tracking, no manual extend/release.
   */
  async using(
    resource: string | string[],
    duration: number,
    settings = REDLOCK_DEFAULTS,
    routine?: (signal: RedlockAbortSignal) => Promise<unknown>,
  ) {
    const resources = Array.isArray(resource) ? resource : [resource];
    return this._redlock.using(resources, duration, settings, routine);
  }

  /**
   * Manual lock acquisition.
   * Lock is tracked and must be released explicitly.
   */
  async acquire(
    resource: string | string[],
    duration = 5_000,
    settings = REDLOCK_DEFAULTS,
  ): Promise<Lock> {
    const resources = Array.isArray(resource) ? resource : [resource];
    const key = this.normalize(resources);
    const lock = await this._redlock.acquire(resources, duration, settings);
    this._locks.set(key, lock);
    return lock;
  }

  /**
   * Extend an existing tracked lock.
   */
  async extend(
    resource: string | string[],
    duration = 5_000,
    settings = REDLOCK_DEFAULTS,
  ): Promise<Lock> {
    const key = this.normalize(resource);
    const lock = this._locks.get(key);
    if (!lock) throw new Error(`No lock found for resource: ${key}`);
    const extended = await this._redlock.extend(lock, duration, settings);
    this._locks.set(key, extended);
    return extended;
  }

  /**
   * Release a tracked lock.
   */
  async release(
    resource: string | string[],
    settings = REDLOCK_DEFAULTS,
  ): Promise<void> {
    const key = this.normalize(resource);
    const lock = this._locks.get(key);
    if (!lock) return;

    try {
      await this._redlock.release(lock, settings);
    } finally {
      this._locks.delete(key);
    }
  }

  /**
   * Optional access for diagnostics / introspection.
   */
  getLock(resource: string | string[]): Lock | undefined {
    return this._locks.get(this.normalize(resource));
  }

  async onModuleDestroy() {
    await Promise.allSettled(
      Array.from(this._locks.values()).map((lock) =>
        this._redlock.release(lock, REDLOCK_DEFAULTS),
      ),
    );
    this._locks.clear();
    await this._redlock.quit();
  }

  get redlock() {
    return this._redlock;
  }

  private normalize(resource: string | string[]): string {
    return (Array.isArray(resource) ? resource : [resource])
      .slice()
      .sort()
      .join('|');
  }
}
