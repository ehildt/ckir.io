import type { Vision } from "../store/use-vision/use-vision.model";
import { useLazyVisionStore } from "./socketio.client";
import type { VisionResponse } from "./socketio.model";

export function handleVisionCompare(vres: VisionResponse) {
  const vStore = useLazyVisionStore();
  const hashes = new Set(vres.meta.map((m) => m.hash));
  const atts = vStore.atts.filter((v) => hashes.has(v.hash!));
  const combinedHash = atts.map(({ hash }) => hash).join("_");
  const cmp = vStore.cmps.find((v) => v.hash === combinedHash);

  if (atts.length && !cmp) {
    const vision: Vision = {
      vRefs: atts,
      groupId: atts[0]!.groupId,
      hash: combinedHash,
      status: "pending",
      chunk: vres,
      message: vres.message,
    };

    vStore.append("cmps", vision);
    vStore.append("conv", vision);
  }

  if (atts.length && cmp) {
    const vision: Vision = {
      ...cmp,
      chunk: vres,
      status: vres.done ? "done" : "fetching",
      message: {
        role: vres.message.role,
        content: `${cmp.message?.content}${vres.message.content}`,
      },
    };

    vStore.replace("cmps", vision);
    vStore.replace("conv", vision);

    atts.forEach((att) => {
      vStore.replace("atts", {
        ...att,
        status: vres.done ? "done" : "fetching",
        message: {
          role: vres.message.role,
          content: `${att.message?.content}${vres.message.content}`,
        },
        chunk: vres,
      });
    });
  }

  if (vres.done && atts.length) vStore.remove("atts", atts);
}
