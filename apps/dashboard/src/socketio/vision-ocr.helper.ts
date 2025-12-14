import type { Vision } from "../store/use-vision/use-vision.model";
import { useLazyVisionStore } from "./socketio.client";
import type { VisionResponse } from "./socketio.model";

export function handleVisionOCR(vres: VisionResponse) {
  const vStore = useLazyVisionStore();
  const hashes = new Set(vres.meta.map((m) => m.hash));
  const atts = vStore.atts.filter((a) => hashes.has(a.hash!));
  const combinedHash = atts.map(({ hash }) => hash).join("_");
  const ocr = vStore.ocrs.find((v) => v.hash === combinedHash);

  if (atts.length && !ocr) {
    const vision: Vision = {
      vRefs: atts,
      groupId: atts[0]!.groupId,
      hash: combinedHash,
      status: "pending",
      chunk: vres,
      message: vres.message,
    };

    vStore.append("conv", vision);
    vStore.append("ocrs", vision);
  }

  if (atts.length && ocr) {
    const vision: Vision = {
      ...ocr,
      chunk: vres,
      status: vres.done ? "done" : "fetching",
      message: {
        role: vres.message.role,
        content: `${ocr.message?.content}${vres.message.content}`,
      },
    };

    vStore.replace("conv", vision);
    vStore.replace("ocrs", vision);

    atts.forEach((att) => {
      vStore.replace("atts", {
        ...att,
        status: vres.done ? "done" : "fetching",
      });
    });
  }

  if (vres.done && atts.length) vStore.remove("atts", atts);
}
