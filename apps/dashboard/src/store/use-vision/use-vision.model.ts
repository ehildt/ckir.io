type VisionResponse = {
  model: string;
  created_at: string;
  message: {
    role: "assistant" | "user";
    content: string;
  };
  done: boolean;
  done_reason: string;
  total_duration: number;
  load_duration: number;
  prompt_eval_count: number;
  prompt_eval_duration: number;
  eval_count: number;
  eval_duration: number;
};

export type VisionTask = "describe" | "compare" | "ocr";

export type VisionState = {
  llm: string;
  room: string;
  stream: boolean;
  prompt: string;
  task: VisionTask;
  isPending: boolean;
  attachments: Array<File>;
  results: Array<VisionResponse>;
};
