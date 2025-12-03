import { fileComparator } from "./file-comparator.helper";
import type { Vision, VisionPatch, VisionState } from "./use-vision.model";

export function appendDscs(this: VisionState, visions: Array<Vision> | Vision) {
  const normalized = Array.isArray(visions) ? visions : [visions];
  const toAppend = normalized.filter((v) => !this.dscs.some((d) => d.hash === v.hash));
  this.dscs = this.dscs.concat(toAppend);
}

export function removeDscs(this: VisionState, visions: Vision | Array<Vision>) {
  const toRemove = Array.isArray(visions) ? visions : [visions];
  this.dscs = this.dscs.filter((vA) => !toRemove.some((vB) => fileComparator(vA.file, vB.file)));
}

export function replaceDscs(this: VisionState, visions: Vision | Array<Vision>) {
  const toReplace = Array.isArray(visions) ? visions : [visions];
  this.dscs = this.dscs.map((vA) => {
    const exists = toReplace.find((vB) => fileComparator(vB.file, vA.file));
    return exists ? exists : vA;
  });
}

export function patchDscs(this: VisionState, partial: VisionPatch | Array<VisionPatch>) {
  const patches = Array.isArray(partial) ? partial : [partial];
  for (const p of patches) {
    const match = this.dscs.find((v) => fileComparator(v.file, p.file));
    if (match) Object.assign(match, p);
  }
}
