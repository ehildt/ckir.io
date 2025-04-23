import { ServerOptions } from 'socket.io';

export type SocketIOConfig = {
  port: number;
  event: string;
  opts: Partial<ServerOptions>;
};
