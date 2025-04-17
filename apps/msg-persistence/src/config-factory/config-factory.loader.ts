import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';

@Injectable()
export class ConfigFactoryLoader {
  public loadYAML<T = unknown>(path: string, encoding: BufferEncoding = 'utf8') {
    return load(readFileSync(path, encoding), { json: true, filename: path }) as T;
  }

  public loadJSON<T = unknown>(path: string, encoding: BufferEncoding = 'utf8') {
    return JSON.parse(readFileSync(path, encoding)) as T;
  }
}
