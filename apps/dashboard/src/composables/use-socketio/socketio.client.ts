// socket.ts
import { io, Socket } from "socket.io-client";
import { reactive } from "vue";

type ServerToClientEvents = {
  getVision: (msg: any) => void;
  joinRoom: (msg: any) => void;
  leaveRoom: (msg: any) => void;
};

type ClientToServerEvents = {
  joinRoom: (msg: any) => void;
  leaveRoom: (msg: any) => void;
};

type VisionResponse = { value: Record<any, any>; hash: string; jobId: any; pid: any };

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  import.meta.env.VITE_VISIONS_SOCKETIO_URL,
  {
    transports: ["websocket", "polling"],
  },
);

export const state = reactive({
  connected: false,
  messages: [] as VisionResponse[],
});

socket.on("connect", () => {
  console.log("CLIENT connected", socket.id);
  // here we would fetch the user data
  // and take the users private room from there
  socket.emit("joinRoom", { room: "pipiaa" });
  console.log(`joining room pipiaa`);
  state.connected = true;
});

socket.on("connect_error", (err) => {
  console.error("CLIENT connect_error", err.message, err);
});

socket.on("disconnect", () => {
  state.connected = false;
});

socket.on("getVision", (msg: VisionResponse) => {
  const idx = state.messages.findIndex(({ hash }) => hash === msg.hash);
  console.log(msg);
  if (idx !== -1 && state.messages[idx])
    state.messages[idx].value = {
      ...msg.value,
      content: state.messages[idx].value.content.concat(msg.value.content),
    };
  else state.messages.push(msg);
});
