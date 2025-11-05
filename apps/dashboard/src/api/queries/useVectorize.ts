import { type QueryKey, useQuery, type UseQueryReturnType } from "@tanstack/vue-query";

export default function useFetchQuery<T = unknown>(options: {
  queryKey: QueryKey;
  url: string;
  init?: RequestInit;
  includeUrlInKey?: boolean;
}): UseQueryReturnType<T, Error> {
  const key = options.includeUrlInKey
    ? [...(options.queryKey as unknown[]), options.url]
    : options.queryKey;

  return useQuery<T, Error>({
    enabled: false,
    queryKey: key,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await fetch(options.url, options.init);
      if (!res.ok) throw new Error("Network error");
      return res.json() as Promise<T>;
    },
  });
}
