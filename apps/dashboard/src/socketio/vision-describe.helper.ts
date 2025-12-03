import { useLazyVisionStore } from "./socketio.client";
import type { VisionResponse, VisionResponseMeta } from "./socketio.model";

export function handleVisionDescribe(vres: VisionResponse) {
  const vStore = useLazyVisionStore();
  const att = vStore.atts.find((v) => (vres.meta as VisionResponseMeta).hash === v.hash);
  const des = vStore.dscs.find((v) => (vres.meta as VisionResponseMeta).hash === v.hash);

  if (att && !des) {
    vStore.appendDscs({
      ...att,
      status: "pending",
      chunk: vres,
      text: `${att.text}${vres.message.content}`,
    });
  }

  if (att && des && !vres.done) {
    vStore.replaceDscs({
      ...des,
      status: "fetching",
      text: `${des.text}${vres.message.content}`,
      chunk: vres,
    });

    vStore.replaceAtts({
      ...att,
      status: "fetching",
      text: `${att.text}${vres.message.content}`,
      chunk: vres,
    });
  }

  if (vres.done && des && att) {
    vStore.replaceDscs({
      ...des,
      status: "done",
      chunk: vres,
      text: `${des.text}${vres.message.content}`,
    });
    vStore.removeAtts(att);
  }
}
