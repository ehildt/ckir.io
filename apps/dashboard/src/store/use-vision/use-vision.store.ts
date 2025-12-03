import { defineStore } from "pinia";

import type { VisionState } from "./use-vision.model";
import { appendAtts, patchAtts, removeAtts, replaceAtts } from "./vision-atts.actions";
import { appendCmps, patchCmps, removeCmps, replaceCmps } from "./vision-cmps.actions";
import { setPrompt, setTask } from "./vision-ctx.actions";
import { appendDscs, patchDscs, removeDscs, replaceDscs } from "./vision-dscs.actions";
import { appendOcrs, patchOcrs, removeOcrs, replaceOcrs } from "./vision-ocrs.actions";

export const useVisionStore = defineStore("visions", {
  state: (): VisionState => ({
    atts: [],
    ocrs: [],
    cmps: [],
    dscs: [],
    conv: [], // what will be rendered by default in main with future tab: conv | dscs | cmps | ocrs
    ctx: {
      sropts: {
        room: "foo@bar.com",
      },
      vropts: {
        stream: true,
        task: "describe",
        llm: "ministral-3:14b",
        prompt: undefined,
      },
    },
  }),
  actions: {
    patchAtts,
    appendAtts,
    removeAtts,
    replaceAtts,
    patchDscs,
    appendDscs,
    removeDscs,
    replaceDscs,
    patchCmps,
    appendCmps,
    removeCmps,
    replaceCmps,
    patchOcrs,
    appendOcrs,
    removeOcrs,
    replaceOcrs,
    setTask,
    setPrompt,
  },
});
