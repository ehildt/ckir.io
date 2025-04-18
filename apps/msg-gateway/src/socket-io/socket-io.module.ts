import { DynamicModule, Logger, Module } from '@nestjs/common';
import { Server } from 'socket.io';

import { SocketIOConfig } from '../config-factory/config-factory.model';
import { SOCKET_IO_SERVER } from './socket-io.constants';
import { SocketIOService } from './socket-io.service';

type SocketIOConfigFactory = (...deps: any[]) => Promise<SocketIOConfig>;

type SocketIOModuleProps = {
  isGlobal?: boolean;
  inject: Array<any>;
  useFactory: SocketIOConfigFactory;
};

@Module({})
export class SocketIOModule {
  static registerAsync(options: SocketIOModuleProps): DynamicModule {
    return {
      module: SocketIOModule,
      global: options.isGlobal,
      exports: [SOCKET_IO_SERVER, SocketIOService],
      providers: [
        Logger,
        SocketIOService,
        {
          provide: SOCKET_IO_SERVER,
          inject: options.inject,
          useFactory: async (...deps) => {
            const { port, opts } = await options.useFactory(...deps);
            return new Server(port, opts);
          },
        },
      ],
    };
  }
}
