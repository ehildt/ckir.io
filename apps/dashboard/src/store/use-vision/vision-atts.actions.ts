import { toast } from "vue3-toastify";

import { fileComparator } from "./file-comparator.helper";
import type { Vision, VisionPatch, VisionState } from "./use-vision.model";

export function appendAtts(this: VisionState, visions: Array<Vision> | Vision) {
  const nVision = Array.isArray(visions) ? visions : [visions];
  const hashSet = new Set(nVision.map(({ hash }) => hash));
  const toAppend = Array.from(hashSet).map((hash) => nVision.find((v) => v.hash === hash));
  const notToAppend = nVision.filter((v) => !toAppend.includes(v));
  notToAppend.forEach((att, index) => {
    toast(
      `<div style="
    width: 260px;
    min-height: 72px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding: 8px 10px;
    border-radius: 8px;
  ">
        <h1>${(att.file as File).name}</h1>
        <hr />
        <p>file blob is duplicate</p>
      </div>`,
      {
        type: "warning",
        autoClose: 3000,
        position: "top-right",
        delay: index * 300,
        dangerouslyHTMLString: true,
      },
    );
  });

  this.atts = this.atts.concat(toAppend as Vision[]);
}

export function removeAtts(this: VisionState, visions: Vision | Array<Vision>) {
  const toRemove = Array.isArray(visions) ? visions : [visions];
  this.atts = this.atts.filter((vA) => !toRemove.some((vB) => fileComparator(vA.file, vB.file)));
}

export function replaceAtts(this: VisionState, visions: Vision | Array<Vision>) {
  const toReplace = Array.isArray(visions) ? visions : [visions];
  this.atts = this.atts.map((vA) => {
    const exists = toReplace.find((vB) => fileComparator(vB.file, vA.file));
    return exists ? exists : vA;
  });
}

export function patchAtts(this: VisionState, partial: VisionPatch | Array<VisionPatch>) {
  const patches = Array.isArray(partial) ? partial : [partial];
  for (const p of patches) {
    const match = this.atts.find((v) => fileComparator(v.file, p.file));
    if (match) Object.assign(match, p);
  }
}
