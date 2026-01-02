import { QdrantSearchResponses } from '@ehildt/ckir-qdrant';

type QdrantMatch = QdrantSearchResponses[number][number];

export type DedupedAggregatedPayload = {
  aggregatedPayloadIds: Array<unknown>;
  matches: Array<QdrantMatch>;
};

const byScoreThenVersionDesc = (a: QdrantMatch, b: QdrantMatch) =>
  b.score - a.score || b.version - a.version;

const scoreKey = (score: number, precision = 4) => score.toFixed(precision);

const payloadIdOf = (m: QdrantMatch) =>
  (m.payload as Record<PropertyKey, unknown> | null | undefined)?.id;

export function dedupeAndAggregate(
  items: QdrantSearchResponses,
  opts?: { scorePrecision?: number },
): Array<DedupedAggregatedPayload> {
  const precision = opts?.scorePrecision ?? 4;
  const aggregation = new Map<
    string,
    DedupedAggregatedPayload & { _matchIds?: Set<string> }
  >();

  for (const item of items.flat().sort(byScoreThenVersionDesc)) {
    const key = scoreKey(item.score, precision);
    const agg =
      aggregation.get(key) ??
      (() => {
        const v: DedupedAggregatedPayload & { _matchIds?: Set<string> } = {
          aggregatedPayloadIds: [],
          matches: [],
          _matchIds: new Set(),
        };
        aggregation.set(key, v);
        return v;
      })();

    if (!agg._matchIds!.has(String(item.id))) {
      agg.matches.push(item);
      agg._matchIds!.add(String(item.id));

      const pid = payloadIdOf(item);
      if (pid !== undefined && pid !== null)
        agg.aggregatedPayloadIds.push(String(pid));
    }
  }

  for (const agg of aggregation.values()) {
    agg.aggregatedPayloadIds = [...new Set(agg.aggregatedPayloadIds)];
    delete agg._matchIds;
  }

  return [...aggregation.values()];
}
