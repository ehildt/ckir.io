import type { Vision } from "../store/use-vision/use-vision.model";
import { useLazyVisionStore } from "./socketio.client";
import type { VisionResponse } from "./socketio.model";

export function handleVisionDescribe(vres: VisionResponse) {
  const vStore = useLazyVisionStore();
  const hashes = new Set(vres.meta.map((m) => m.hash));
  const atts = vStore.atts.filter((a) => hashes.has(a.hash!));
  const combinedHash = atts.map(({ hash }) => hash).join("_");
  const dsc = vStore.dscs.find((v) => v.hash === combinedHash);

  if (atts.length && !dsc) {
    const vision: Vision = {
      vRefs: atts,
      batchId: atts[0]!.batchId,
      hash: combinedHash,
      status: "pending",
      chunk: vres,
      message: vres.message,
    };

    vStore.append("conv", vision);
    vStore.append("dscs", vision);
  }

  if (atts.length && dsc) {
    const vision: Vision = {
      ...dsc,
      chunk: vres,
      status: vres.done ? "done" : "fetching",
      message: {
        role: vres.message.role,
        content: `${dsc.message?.content}${vres.message.content}`,
      },
    };

    vStore.replace("conv", vision);
    vStore.replace("dscs", vision);

    atts.forEach((att) => {
      vStore.replace("atts", {
        ...att,
        status: vres.done ? "done" : "fetching",
      });
    });
  }

  if (vres.done && atts.length) vStore.remove("atts", atts);
}
