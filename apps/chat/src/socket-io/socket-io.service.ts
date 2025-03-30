import { Inject, Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import { SOCKET_IO_SERVER } from './socket-io.module';

type SocketIOListener = (socket: Socket, ...args: [reason?: string, description?: string]) => Promise<void> | void;
type SocketIORecord = { [key: string]: SocketIOListener };

/**
 * SocketIOService provides methods to interact with a Socket.IO server.
 * This service allows emitting events and subscribing to events in different namespaces.
 */
@Injectable()
export class SocketIOService {
  /**
   * Creates an instance of the SocketIOService.
   * @param logger The logger instance for logging messages.
   * @param server The Socket.IO server instance injected via the SOCKET_IO_SERVER token.
   */
  constructor(
    private readonly logger: Logger,
    @Inject(SOCKET_IO_SERVER) private readonly server: Server,
  ) {}

  /**
   * Emits an event to the Socket.IO server.
   * @param ev The event name to emit.
   * @param message The message to send with the event.
   * @returns The instance of SocketIOService to allow method chaining.
   * @example
   * socketService.emit('message', { text: 'Hello, world!' });
   */
  public emit(ev: string, message: unknown) {
    this.server.emit(ev, message);
    return this;
  }

  /**
   * Subscribes to a specific event or multiple events in the Socket.IO server. \
   * If a single event is passed with a callback, it will listen to that specific event. \
   * If a record of events is passed, it will listen to all specified events with their respective callbacks.
   *
   * @param event The event name or a record of events.
   * @param cb The callback function to handle the event.
   * @returns The instance of SocketIOService to allow method chaining.
   * @example
   * // Subscribing to a single event:
   * socketService.on('message', (socket, reason, description) => {
   *   console.log(`Received message: ${reason} - ${description}`);
   * });
   *
   * // Subscribing to multiple events:
   * socketService.on(
   *    {
   *      'message': (socket, reason, description) => { ... },
   *      disconnect(socket) {
   *        ...
   *      },
   *    }
   * );
   */
  public on(event: string | SocketIORecord, cb?: SocketIOListener) {
    if (typeof event === 'string' && cb) {
      this.logger.log(`subscribed to namespace "${event}".`, 'Socket.IO');
      this.server.on('connection', (socket: Socket) => {
        socket.on(event, async (...args) => await cb(socket, ...args));
      });
    }

    if (typeof event === 'object' && !cb) {
      this.logger.log(`subscribed to namespaces ${JSON.stringify(Object.keys(event))}`, 'Socket.IO');
      this.server.on('connection', (socket: Socket) =>
        Object.entries(event).forEach(([key, cb]) => socket.on(key, async (...args) => await cb(socket, ...args))),
      );
    }

    return this;
  }
}
