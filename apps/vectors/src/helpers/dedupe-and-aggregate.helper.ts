import { QdrantSearchResponses } from '@ckir.io/qdrant';

export type DedupedAggregatedPayload = {
  ids: Array<string>;
  matches: Array<QdrantSearchResponses[number][number]>;
};

export function dedupeAndAggregate(
  items: QdrantSearchResponses,
): Array<DedupedAggregatedPayload> {
  const aggregation = new Map<string, any>();

  for (const item of items.flat().sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.version - a.version;
  })) {
    const key = item.score.toFixed(4);
    if (aggregation.has(key)) {
      const agg = aggregation.get(key);
      agg.matches.push(item);
      agg.ids.push(item.payload?.id);
    } else {
      aggregation.set(key, {
        ids: [item.payload?.id],
        matches: [item],
      });
    }
  }

  return Array.from(aggregation.values()).map(
    (agg: DedupedAggregatedPayload) => {
      agg.ids = Array.from(new Set(agg.ids));
      return agg;
    },
  );
}
