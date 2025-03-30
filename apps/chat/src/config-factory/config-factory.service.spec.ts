import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigFactoryModule } from './config-factory.module';
import { ConfigFactoryService } from './config-factory.service';

describe('ConfigFactoryService', () => {
  let factory: ConfigFactoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigFactoryModule.forRoot({ isGlobal: true })],
      providers: [Logger],
    }).compile();

    factory = module.get<ConfigFactoryService>(ConfigFactoryService);
  });

  describe('app', () => {
    it('should return a valid App object after parsing the config.yml', () => {
      expect(factory.appConfig).toEqual({
        port: 3003,
        bodyLimit: 16777216,
        address: '0.0.0.0',
        enableSwagger: true,
        printConfig: true,
        nodeEnv: 'test', // because jest sets the NODE_ENV to test
        brcsChannel: 'CHAT_BRCS',
      });
    });
  });
});
