import { io, Socket } from "socket.io-client";

import { useVisionStore } from "../store/use-vision/use-vision.store";
import type { ClientToServerEvents, ServerToClientEvents } from "./socketio.model";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  import.meta.env.VITE_VISIONS_SOCKETIO_URL,
  { transports: ["websocket"] },
);

// lazy loading the pinia store
let vStore: ReturnType<typeof useVisionStore> | null = null;
export const useLazyVisionStore = () => {
  if (!vStore) vStore = useVisionStore();
  return vStore;
};

socket.on("connect", async () => {
  socket.emit("joinRoom", "foo@bar.com", (ok, error) => {
    if (!ok) console.error(error);
    else console.log("client joined room foo@bar.com");
  });
});
