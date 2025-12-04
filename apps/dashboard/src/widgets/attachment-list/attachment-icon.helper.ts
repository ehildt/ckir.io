export type MapIcon = "cancel" | "fetching" | "pending" | "image/jpeg" | "image/png" | "image/webp";

export const ICON_MAP = new Map<MapIcon, string>([
  ["cancel", "icon-[line-md--cancel]"],
  ["fetching", "icon-[line-md--downloading-loop]"],
  ["pending", "icon-[eos-icons--three-dots-loading]"],
  ["image/jpeg", "icon-[iconoir--jpeg-format]"],
  ["image/png", "icon-[iconoir--png-format]"],
  ["image/webp", "icon-[iconoir--webp-format]"],
]);
