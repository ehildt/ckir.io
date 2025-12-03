import { fileComparator } from "./file-comparator.helper";
import type { Vision, VisionPatch, VisionState } from "./use-vision.model";

export function appendOcrs(this: VisionState, visions: Array<Vision> | Vision) {
  const normalized = Array.isArray(visions) ? visions : [visions];
  const toAppend = normalized.filter((v) => !this.ocrs.some((d) => d.hash === v.hash));
  this.ocrs = this.ocrs.concat(toAppend);
}

export function removeOcrs(this: VisionState, visions: Vision | Array<Vision>) {
  const toRemove = Array.isArray(visions) ? visions : [visions];
  this.ocrs = this.ocrs.filter((vA) => !toRemove.some((vB) => fileComparator(vA.file, vB.file)));
}

export function replaceOcrs(this: VisionState, visions: Vision | Array<Vision>) {
  const toReplace = Array.isArray(visions) ? visions : [visions];
  this.ocrs = this.ocrs.map((vA) => {
    const exists = toReplace.find((vB) => fileComparator(vB.file, vA.file));
    return exists ? exists : vA;
  });
}

export function patchOcrs(this: VisionState, partial: VisionPatch | Array<VisionPatch>) {
  const patches = Array.isArray(partial) ? partial : [partial];
  for (const p of patches) {
    const match = this.ocrs.find((v) => fileComparator(v.file, p.file));
    if (match) Object.assign(match, p);
  }
}
