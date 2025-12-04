import type { Vision } from "./use-vision.model";

export function hashComparator(vA?: Vision | Vision[], vB?: Vision | Vision[]): boolean {
  if (!vA || !vB) return false;
  const aList = Array.isArray(vA) ? vA : [vA];
  const bList = Array.isArray(vB) ? vB : [vB];
  return aList.some((a) => bList.some((b) => a.hash === b.hash));
}
