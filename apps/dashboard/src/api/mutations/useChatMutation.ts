import { type MutationFunctionContext, type MutationKey, useMutation } from "@tanstack/vue-query";

type ChatMutationVariables = {
  init?: RequestInit;
  req: RequestInfo | URL;
};

type OnSettled<TData, TError, TVars, TCtx> = (
  data: TData | undefined,
  error: TError | null,
  variables: TVars,
  onMutateResult: TCtx | undefined,
  context: MutationFunctionContext,
) => void | Promise<unknown>;

type OnSuccess<TData, TVars, TCtx> = (
  data: TData,
  variables: TVars,
  context: TCtx | undefined,
) => void | Promise<unknown>;

export default function useChatMutation<TData = unknown, TOnMutateResult = unknown>(opts: {
  mutationKey: MutationKey;
  onSettled?: OnSettled<TData, Error, ChatMutationVariables, TOnMutateResult>;
  onSuccess?: OnSuccess<TData, ChatMutationVariables, TOnMutateResult>;
}) {
  return useMutation<TData, Error, ChatMutationVariables, TOnMutateResult>({
    mutationKey: opts.mutationKey,
    networkMode: "online",
    onSettled: opts.onSettled,
    onSuccess: opts.onSuccess,
    mutationFn: async ({ req, init }) => {
      const res = await fetch(req, init);
      if (!res.ok) throw new Error("Network error");
      return res.json() as Promise<TData>;
    },
  });
}
