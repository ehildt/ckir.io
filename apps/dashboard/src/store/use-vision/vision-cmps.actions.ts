import { fileComparator } from "./file-comparator.helper";
import type { Vision, VisionPatch, VisionState } from "./use-vision.model";

export function appendCmps(this: VisionState, visions: Array<Vision> | Vision) {
  const normalized = Array.isArray(visions) ? visions : [visions];
  const toAppend = normalized.filter((v) => !this.cmps.some((d) => d.hash === v.hash));

  this.cmps = this.cmps.concat(toAppend);
}

export function removeCmps(this: VisionState, visions: Vision | Array<Vision>) {
  const toRemove = Array.isArray(visions) ? visions : [visions];
  this.cmps = this.cmps.filter((vA) => !toRemove.some((vB) => fileComparator(vA.file, vB.file)));
}

export function replaceCmps(this: VisionState, visions: Vision | Array<Vision>) {
  const toReplace = Array.isArray(visions) ? visions : [visions];
  this.cmps = this.cmps.map((vA) => {
    const exists = toReplace.find((vB) => fileComparator(vB.file, vA.file));
    return exists ? exists : vA;
  });
}

export function patchCmps(this: VisionState, partial: VisionPatch | Array<VisionPatch>) {
  const patches = Array.isArray(partial) ? partial : [partial];
  for (const p of patches) {
    const match = this.cmps.find((v) => fileComparator(v.file, p.file));
    if (match) Object.assign(match, p);
  }
}
