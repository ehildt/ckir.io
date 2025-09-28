import { QdrantSearchResponses } from '@ckir.io/qdrant';

export function dedupeAndAggregate(items: QdrantSearchResponses) {
  const aggregation = new Map<string, any>();
  for (const item of items.flat().sort((a: any, b: any) => b.score - a.score)) {
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
  return Array.from(aggregation.values());
}
