import { DynamicModule, Logger, Module } from '@nestjs/common';
import { Server } from 'socket.io';

import { SocketIOConfig } from '../config-factory/config-factory.model';
import { ConfigFactoryService } from '../config-factory/config-factory.service';
import { SOCKET_IO_SERVER } from './socket-io.constants';
import { SocketIOService } from './socket-io.service';

type SocketIOModuleProps = {
  isGlobal?: boolean;
  imports?: Array<any>;
  inject?: Array<any>;
  providers?: Array<any>;
  useFactory: (...deps: any[]) => SocketIOConfig;
};

@Module({})
export class SocketIOModule {
  static register(options: SocketIOModuleProps): DynamicModule {
    return {
      module: SocketIOModule,
      global: options.isGlobal,
      exports: [SOCKET_IO_SERVER, SocketIOService],
      providers: [
        ...(options?.providers ?? []),
        Logger,
        SocketIOService,
        {
          provide: SOCKET_IO_SERVER,
          inject: options.inject ?? [],
          useFactory: ({ socketIOConfig }: ConfigFactoryService) =>
            new Server(socketIOConfig.port, socketIOConfig.opts),
        },
      ],
    };
  }
}
