import { useLazyVisionStore } from "./socketio.client";
import type { VisionResponse } from "./socketio.model";

export function handleVisionCompare(vres: VisionResponse) {
  const vStore = useLazyVisionStore();
  const metas = Array.isArray(vres.meta) ? vres.meta : [vres.meta];
  const hash = metas.map(({ hash }) => hash).join(",");
  const atts = vStore.atts.filter(({ hash }) => metas.some((v) => hash === v.hash));

  if (vres.done && atts?.length) {
    const files = atts.map(({ file }) => file)?.flat();
    const text = atts.map(({ text }) => text).join("");
    vStore.appendCmps({ file: files, text, hash, status: "done", chunk: vres });
    vStore.removeAtts(atts);
  } else {
    metas.forEach(({ hash }) => {
      const v = vStore.atts.find((v) => hash === v.hash);
      if (v) {
        vStore.replaceAtts({
          ...v,
          status: "fetching",
          text: `${v.text}${vres.message.content}`,
          chunk: vres,
        });
      }
    });
  }
}
