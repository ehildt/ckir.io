import { defineStore } from "pinia";

import type { VisionState } from "./use-vision.model";
import { append, patch, remove, replace } from "./vision.actions";
import { setPrompt, setTab, setTask } from "./vision-ctx.actions";

export const useVisionStore = defineStore("visions", {
  state: (): VisionState => ({
    atts: [],
    ocrs: [],
    cmps: [],
    dscs: [],
    conv: [],
    ctx: {
      view: {
        tab: "conv",
      },
      sropts: {
        room: "foo@bar.com",
      },
      vropts: {
        stream: true,
        task: "describe",
        textAgent: "ministral-3:14b",
        visionAgent: "ministral-3:14b",
        prompt: "",
      },
    },
  }),
  actions: {
    patch,
    append,
    remove,
    replace,
    setTab,
    setTask,
    setPrompt,
  },
});
