import { Test, TestingModule } from '@nestjs/testing';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';

import { ConfigFactoryLoader } from './config-factory.loader';

jest.mock('fs', () => ({
  readFileSync: jest.fn(),
}));

jest.mock('js-yaml', () => ({
  load: jest.fn(),
}));

describe('ConfigFactoryLoader', () => {
  let configFactoryLoader: ConfigFactoryLoader;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigFactoryLoader],
    }).compile();

    configFactoryLoader = module.get<ConfigFactoryLoader>(ConfigFactoryLoader);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loadYAML', () => {
    it('should correctly load YAML data', () => {
      const mockYAMLData = { key: 'value' };
      const path = 'mock/path/to/config.yaml';
      (readFileSync as jest.Mock).mockReturnValue('key: value');
      (yaml.load as jest.Mock).mockReturnValue(mockYAMLData);
      const result = configFactoryLoader.loadYAML(path);
      expect(readFileSync).toHaveBeenCalledWith(path, 'utf8');
      expect(yaml.load).toHaveBeenCalledWith('key: value', { json: true, filename: path });
      expect(result).toEqual(mockYAMLData);
    });

    it('should throw an error if YAML parsing fails', () => {
      const path = 'mock/path/to/config.yaml';
      (readFileSync as jest.Mock).mockReturnValue('invalid: yaml');
      (yaml.load as jest.Mock).mockImplementation(() => {
        throw new Error('YAML parse error');
      });

      expect(() => configFactoryLoader.loadYAML(path)).toThrowError('YAML parse error');
    });
  });

  describe('loadJSON', () => {
    it('should correctly load JSON data', () => {
      const mockJSONData = { key: 'value' };
      const path = 'mock/path/to/config.json';
      (readFileSync as jest.Mock).mockReturnValue('{"key": "value"}');
      const result = configFactoryLoader.loadJSON(path);
      expect(readFileSync).toHaveBeenCalledWith(path, 'utf8');
      expect(result).toEqual(mockJSONData);
    });

    it('should throw an error if JSON parsing fails', () => {
      const path = 'mock/path/to/config.json';
      (readFileSync as jest.Mock).mockReturnValue('invalid json');
      expect(() => configFactoryLoader.loadJSON(path)).toThrowError(SyntaxError);
    });
  });
});
