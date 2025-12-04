import { useLazyVisionStore } from "./socketio.client";
import type { VisionResponse } from "./socketio.model";

export function handleVisionOCR(vres: VisionResponse) {
  const vStore = useLazyVisionStore();
  const hashes = new Set(vres.meta.map((m) => m.hash));

  hashes.forEach((hash) => {
    const att = vStore.atts.find((v) => v.hash === hash);
    const ocr = vStore.ocrs.find((v) => v.hash === hash);

    if (att && !ocr) {
      vStore.append("ocrs", {
        ...att,
        status: "pending",
        chunk: vres,
        message: vres.message,
      });
      vStore.append("conv", {
        ...att,
        status: "pending",
        chunk: vres,
        message: vres.message,
      });
    }

    if (att && ocr) {
      vStore.replace("conv", {
        ...ocr,
        status: vres.done ? "done" : "fetching",
        message: {
          role: vres.message.role,
          content: `${ocr.message?.content}${vres.message.content}`,
        },
        chunk: vres,
      });

      vStore.replace("ocrs", {
        ...ocr,
        status: vres.done ? "done" : "fetching",
        message: {
          role: vres.message.role,
          content: `${ocr.message?.content}${vres.message.content}`,
        },
        chunk: vres,
      });

      vStore.replace("atts", {
        ...ocr,
        status: vres.done ? "done" : "fetching",
        chunk: vres,
        message: {
          role: vres.message.role,
          content: `${ocr.message?.content}${vres.message.content}`,
        },
      });
    }

    if (vres.done && att) vStore.remove("atts", att);
  });
}
