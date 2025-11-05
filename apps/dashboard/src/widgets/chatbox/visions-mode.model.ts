export type VisionTask = "describe" | "compare" | "ocr";
export type VisionMode = "persist" | "embed";
export type VisionValue = VisionTask | VisionMode;
export type VisionProps = { active?: boolean; value?: VisionValue };
