import { useVisionStore } from "../store/use-vision/use-vision.store";
import { socket } from "./socketio.client";
import type { VisionResponse, VisionResponseMeta } from "./socketio.model";

// lazy loading the pinia store
let vStore: ReturnType<typeof useVisionStore> | null = null;
export const getVisionStore = () => {
  if (!vStore) vStore = useVisionStore();
  return vStore;
};

socket.on("vision", (vres: VisionResponse) => {
  const vStore = getVisionStore();
  if (vres.task === "compare" && Array.isArray(vres.meta)) {
    const hash = vres.meta.map(({ hash }) => hash).join(",");
    const res = vStore.atts.find((v) => hash === v.hash);

    if (!res) {
      vStore.append({
        file: { name: vres.meta.map(({ name }) => name).join("\n"), type: "mock" } as any,
        status: "pending",
        hash,
        text: vres.message.content,
        chunk: vres,
      });
    } else if (vres.done) {
      vres.meta.forEach(({ hash }) => {
        const v = vStore.atts.find((v) => hash === v.hash);
        if (v)
          vStore.replace({
            ...v,
            status: "done",
          });
      });
      vStore.replace({
        ...res,
        status: "done",
        text: `${res.text}${vres.message.content}`,
        chunk: vres,
      });
    } else {
      vres.meta.forEach(({ hash }) => {
        const v = vStore.atts.find((v) => hash === v.hash);
        if (v) {
          vStore.replace({
            ...v,
            status: "fetching",
          });
        }
      });
      vStore.replace({
        ...res,
        status: "fetching",
        chunk: vres,
        text: `${res.text}${vres.message.content}`,
      });
    }
  } else {
    const res = vStore.atts.find((v) => (vres.meta as VisionResponseMeta).hash === v.hash);
    if (vres.done && res) {
      vStore.replace({
        ...res,
        status: "done",
        chunk: vres,
        text: `${res.text}${vres.message.content}`,
      });
    } else if (res) {
      vStore.replace({
        ...res,
        status: "fetching",
        text: `${res.text}${vres.message.content}`,
        chunk: vres,
      });
    }
  }
});
