import { socket } from "./socketio.client";
import type { VisionResponse } from "./socketio.model";
import { handleVisionCompare } from "./vision-compare.helper";
import { handleVisionDescribe } from "./vision-describe.helper";
import { handleVisionOCR } from "./vision-ocr.helper";

socket.on("vision", (vres: VisionResponse) => {
  if (vres.task === "describe") return handleVisionDescribe(vres);
  if (vres.task === "compare") return handleVisionCompare(vres);
  if (vres.task === "ocr") return handleVisionOCR(vres);
});
