import { Inject, Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import { SOCKET_IO_SERVER } from './socket-io.constants';
import { SocketIOListener, SocketIORecord } from './socket-io.model';

/**
 * Service for interacting with a Socket.IO server.
 * Provides methods to emit messages and subscribe to messages dynamically.
 */
@Injectable()
export class SocketIOService {
  /**
   * Initializes the SocketIOService.
   * @param logger Logger instance for debugging and monitoring.
   * @param server The Socket.IO server instance injected via the SOCKET_IO_SERVER token.
   */
  constructor(
    private readonly logger: Logger,
    @Inject(SOCKET_IO_SERVER) private readonly server: Server,
  ) {}

  /**
   * Emits an event to all connected clients.
   *
   * @template T The type of the message payload.
   * @param ev The event name to emit.
   * @param message The message payload to send with the event.
   * @returns The instance of `SocketIOService` for method chaining.
   *
   * @example
   * socketService.emit('message', { text: 'Hello, world!' });
   */
  public emit<T = unknown>(ev: string, message: T) {
    this.server.emit(ev, message);
    return this;
  }

  /**
   * Subscribes to a Socket.IO event or multiple messages.
   *
   * - If `event` is a string and `cb` is provided, it listens to that specific event.
   * - If `event` is an object containing multiple event handlers, it subscribes to all specified messages.
   *
   * @template T The type of the data received from the event.
   * @param event The event name to listen for, or a record of event names and their respective handlers.
   * @param cb (Optional) The callback function to execute when the event is triggered.
   * @returns The instance of `SocketIOService` for method chaining.
   *
   * @example
   * // Subscribing to a single event:
   * socketService.on('message', async ({ socket, data }) => {
   *   console.log(`Received message:`, data);
   * });
   *
   * // Subscribing to multiple messages:
   * socketService.on({
   *   message: async ({ socket, data }) => {
   *     console.log('New message:', data);
   *   },
   *   disconnect: async ({ socket }) => {
   *     console.log(`Client disconnected: ${socket.id}`);
   *   },
   * });
   */
  public on<T = any>(
    event: string | SocketIORecord,
    cb?: SocketIOListener<Socket, T>,
  ) {
    if (typeof event === 'string' && cb) {
      this.logger.log(`Subscribed to event: "${event}"`, 'Socket.IO');
      this.server.on('connection', (socket) => {
        socket.on(event, async (data) => {
          await cb({ socket, data: this.handleData<T>(data) });
        });
      });
    }

    if (typeof event === 'object' && !cb) {
      this.logger.log(
        `Subscribed to messages: ${JSON.stringify(Object.keys(event))}`,
        'Socket.IO',
      );
      this.server.on('connection', (socket) =>
        Object.entries(event).forEach(([key, cb]) =>
          socket.on(
            key,
            async (data) =>
              await cb({ socket, data: this.handleData<T>(data) }),
          ),
        ),
      );
    }

    return this;
  }

  private handleData<T = any>(data: T) {
    if (typeof data !== 'string') return data;
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }
}
