// src/composables/useSocketIo.ts
import { computed } from "vue";

import { socket, state } from "./socketio.client";

export function useSocketIo() {
  const isConnected = computed(() => state.connected);
  const messages = computed(() => state.messages);

  return {
    socket,
    state,
    isConnected,
    messages,
  };
}
