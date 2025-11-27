import { io, Socket } from "socket.io-client";

import type { ClientToServerEvents, ServerToClientEvents } from "./socketio.model";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  import.meta.env.VITE_VISIONS_SOCKETIO_URL,
  { transports: ["websocket"] },
);

socket.on("connect", async () => {
  socket.emit("joinRoom", "foo@bar.com", (ok, error) => {
    if (!ok) console.error(error);
    else console.log("client joined room foo@bar.com");
  });
});
