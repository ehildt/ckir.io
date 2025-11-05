import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DefaultEventsMap, Server, Socket } from 'socket.io';

import { SOCKET_IO_SERVER } from './socket-io.constants';
import { SocketIOListener, SocketIORecord } from './socket-io.model';

type SocketListener = {
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>;
  data: string;
};

@Injectable()
export class SocketIOService implements OnModuleInit {
  constructor(
    private readonly logger: Logger,
    @Inject(SOCKET_IO_SERVER) private readonly _server: Server,
  ) {}

  onModuleInit() {
    this.on({
      joinRoom: this.joinRoom.bind(this),
      leaveRoom: this.leaveRoom.bind(this),
    });
  }

  get server() {
    return this._server;
  }

  public emit<T = unknown>(ev: string, message: T) {
    this._server.emit(ev, message);
    return this;
  }

  public emitTo<T = unknown>(ev: string, room: string, message: T) {
    this._server.to(room).emit(ev, message);
    return this;
  }

  async joinRoom({ socket, data }: SocketListener) {
    this.logger.log('attempting to join room', data);
    await socket.join(data);
    this.logger.log(
      `client with id ${socket.id} joined room ${data}`,
      'Socket.IO',
    );
  }

  async leaveRoom({ socket, data }: SocketListener) {
    this.logger.log('attempting to leave room', data);
    await socket.leave(data);
    this.logger.log(
      `client with id ${socket.id} left room ${data}`,
      'Socket.IO',
    );
  }

  public on<T = any>(
    event: string | SocketIORecord,
    cb?: SocketIOListener<Socket, T>,
  ) {
    if (typeof event === 'string' && cb) {
      this.logger.log(`Subscribed to event: "${event}"`, 'Socket.IO');
      this._server.on('connection', (socket) => {
        socket.on(event, async (data) => {
          await cb({ socket, data });
        });
      });
    }

    if (typeof event === 'object' && !cb) {
      this.logger.log(
        `Subscribed to messages: ${JSON.stringify(Object.keys(event))}`,
        'Socket.IO',
      );
      this._server.on('connection', (socket) =>
        Object.entries(event).forEach(([key, cb]) =>
          socket.on(key, async (data) => await cb({ socket, data })),
        ),
      );
    }

    return this;
  }
}
