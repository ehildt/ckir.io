import { hashComparator } from "./hash-comparator.helper";
import type { Vision, VisionList, VisionPatch, VisionState } from "./use-vision.model";

export function append(this: VisionState, vList: VisionList, visions: Vision | Vision[]) {
  const incoming = Array.isArray(visions) ? visions : [visions];
  this[vList] = this[vList].concat(incoming);
}

export function remove(this: VisionState, vList: VisionList, visions: Vision | Array<Vision>) {
  const toRemove = Array.isArray(visions) ? visions : [visions];
  this[vList] = this[vList].filter((vA) => !toRemove.some((vB) => hashComparator(vA, vB)));
}

export function replace(
  this: VisionState,
  vList: VisionList,
  visions: Vision | Array<Vision>,
  comparator?: (currentVision: Vision, newVision: Vision) => boolean,
) {
  const toReplace = Array.isArray(visions) ? visions : [visions];
  if (!comparator)
    this[vList] = this[vList].map((vA) => toReplace.find((vB) => hashComparator(vA, vB)) ?? vA);
  this[vList] = this[vList].map((vA) => toReplace.find((vB) => comparator?.(vA, vB)) ?? vA);
}

export function patch(
  this: VisionState,
  vList: VisionList,
  partial: VisionPatch | Array<VisionPatch>,
) {
  const patches = Array.isArray(partial) ? partial : [partial];
  for (const p of patches) {
    const match = this[vList].find((v) => hashComparator(v, p as Vision));
    if (match) Object.assign(match, p);
  }
}
