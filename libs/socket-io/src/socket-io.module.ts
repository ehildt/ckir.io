import { DynamicModule, Logger, Module } from '@nestjs/common';
import { Server } from 'socket.io';

import { SOCKET_IO_SERVER } from './socket-io.constants';
import { SocketIOModuleProps } from './socket-io.model';
import { SocketIOService } from './socket-io.service';

@Module({})
export class SocketIOModule {
  static registerAsync(options: SocketIOModuleProps): DynamicModule {
    return {
      module: SocketIOModule,
      global: options.global,
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
