import { useLazyVisionStore } from "./socketio.client";
import type { VisionResponse, VisionResponseMeta } from "./socketio.model";

export function handleVisionOCR(vres: VisionResponse) {
  const vStore = useLazyVisionStore();
  const res = vStore.atts.find((v) => (vres.meta as VisionResponseMeta).hash === v.hash);
  if (vres.done && res) {
    vStore.appendOcrs({
      ...res,
      status: "done",
      chunk: vres,
      text: `${res.text}${vres.message.content}`,
    });
    vStore.removeAtts(res);
  } else if (res) {
    vStore.replaceAtts({
      ...res,
      status: "fetching",
      text: `${res.text}${vres.message.content}`,
      chunk: vres,
    });
  }
}
