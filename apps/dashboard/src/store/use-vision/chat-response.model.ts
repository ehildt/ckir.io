type TokenLogprob = {
  token: string;
  logprob: number;
};

type Logprob = {
  top_logprobs?: TokenLogprob[];
} & TokenLogprob;

type Message = {
  role: "user" | "assistant";
  content: string;
  thinking?: string;
  images?: Uint8Array[] | string[];
  tool_calls?: ToolCall[];
  tool_name?: string;
};

type ToolCall = {
  function: {
    name: string;
    arguments: {
      [key: string]: any;
    };
  };
};

export type ChatResponse = {
  model: string;
  created_at: Date;
  message: Message;
  done: boolean;
  done_reason: string;
  total_duration: number;
  load_duration: number;
  prompt_eval_count: number;
  prompt_eval_duration: number;
  eval_count: number;
  eval_duration: number;
  logprobs?: Logprob[];
};
