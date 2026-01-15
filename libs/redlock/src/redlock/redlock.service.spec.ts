import { Test, TestingModule } from '@nestjs/testing';
import Redlock, { Lock, Settings } from 'redlock';

import { REDLOCK } from './redlock.constants';
import { RedlockService } from './redlock.service';

describe('RedlockService', () => {
  let service: RedlockService;
  let redlockMock: jest.Mocked<Redlock>;

  beforeEach(async () => {
    redlockMock = {
      acquire: jest.fn(),
      release: jest.fn(),
      extend: jest.fn(),
      quit: jest.fn(),
    } as unknown as jest.Mocked<Redlock>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [RedlockService, { provide: REDLOCK, useValue: redlockMock }],
    }).compile();

    service = module.get<RedlockService>(RedlockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('acquire', () => {
    it('calls redlock.acquire with correct arguments', async () => {
      const resources = ['res1', 'res2'];
      const duration = 1000;
      const settings: Partial<Settings> = { retryCount: 2 };
      const lockMock = {} as Lock;

      redlockMock.acquire.mockResolvedValue(lockMock);

      const result = await service.acquire(resources, duration, settings);
      expect(redlockMock.acquire).toHaveBeenCalledWith(
        resources,
        duration,
        settings,
      );
      expect(result).toBe(lockMock);
    });
  });

  describe('release', () => {
    it('calls redlock.release with correct arguments', async () => {
      const lock = {} as Lock;
      const settings: Partial<Settings> = { driftFactor: 0.01 };

      redlockMock.release.mockResolvedValue(lock);

      const result = await service.release(lock, settings);
      expect(redlockMock.release).toHaveBeenCalledWith(lock, settings);
      expect(result).toBe(lock);
    });
  });

  describe('extend', () => {
    it('calls redlock.extend with correct arguments', async () => {
      const existingLock = {} as Lock;
      const duration = 5000;
      const settings: Partial<Settings> = { retryDelay: 100 };

      redlockMock.extend.mockResolvedValue(existingLock);

      const result = await service.extend(existingLock, duration, settings);
      expect(redlockMock.extend).toHaveBeenCalledWith(
        existingLock,
        duration,
        settings,
      );
      expect(result).toBe(existingLock);
    });
  });

  describe('redlock getter', () => {
    it('returns the underlying redlock instance', () => {
      expect(service.redlock).toBe(redlockMock);
    });
  });

  describe('onModuleDestroy', () => {
    it('calls redlock.quit', async () => {
      redlockMock.quit.mockResolvedValue(undefined);
      await service.onModuleDestroy();
      expect(redlockMock.quit).toHaveBeenCalled();
    });
  });
});
