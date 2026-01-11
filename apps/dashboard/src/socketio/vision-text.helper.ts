import { useLazyVisionStore } from "./socketio.client";
import type { VisionResponse } from "./socketio.model";

export function handleVisionText(vres: VisionResponse) {
  const vStore = useLazyVisionStore();
  const hashes = new Set(vres.meta.map((m) => m.hash));
  Array.from(hashes).forEach((hash) => {
    let vmsg = vStore.conv.find((v) => v.hash === hash && v.batchId === hash);
    if (!vmsg) vmsg = vStore.dscs.find((v) => v.hash === hash && v.batchId === hash);
    if (!vmsg) vmsg = vStore.cmps.find((v) => v.hash === hash && v.batchId === hash);
    if (!vmsg) vmsg = vStore.ocrs.find((v) => v.hash === hash && v.batchId === hash);

    if (!vmsg) {
      vStore.append("conv", {
        hash,
        batchId: hash,
        chunk: vres,
        status: "pending",
        message: vres.message,
      });
    }

    if (vmsg) {
      vStore.replace("conv", {
        ...vmsg,
        status: vres.done ? "done" : "fetching",
        chunk: vres,
        message: {
          role: vres.message.role,
          content: `${vmsg.message?.content}${vres.message.content}`,
        },
      });
    }
  });
}
