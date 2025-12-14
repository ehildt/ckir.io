import { QdrantSearchResponses } from '@ehildt/ckir-qdrant';

type QdrantMatch = QdrantSearchResponses[number][number];

export type DedupedAggregatedPayload = {
  sharedPayloadIds: Array<unknown>;
  matches: Array<QdrantMatch>;
};

const byScoreThenVersionDesc = (a: QdrantMatch, b: QdrantMatch) =>
  b.score - a.score || b.version - a.version;

const scoreKey = (score: number, precision = 4) => score.toFixed(precision);

const payloadIdOf = (m: QdrantMatch) =>
  (m.payload as Record<PropertyKey, unknown> | null | undefined)?.id;

/**
 * Aggregates Qdrant search results into score-buckets while preserving all findings.
 *
 * Behavior:
 * - Flattens all batch searches into a single list of matches.
 * - Sorts matches by descending similarity score, then by descending version.
 * - Groups matches by a score key computed via `score.toFixed(scorePrecision)` (default precision: 4).
 * - For each score-bucket:
 *   - `matches` contains every match that falls into that bucket (no deduplication of matches).
 *   - `sharedPayloadIds` contains the unique set of payload identifiers (`payload.id`) observed in that bucket,
 *     intended to support fetching payload data once for all matches sharing the same payload.
 *
 * Notes:
 * - Bucketing by rounded score intentionally coalesces matches with very similar scores; adjust
 *   `scorePrecision` to control the bucket granularity.
 * - Matches lacking `payload.id` are still included in `matches` but do not contribute to `sharedPayloadIds`.
 *
 * @param items - Batched Qdrant search responses (array-of-arrays of matches) to aggregate.
 * @param opts - Optional configuration.
 * @param opts.scorePrecision - Decimal precision used to form score buckets (defaults to 4).
 * @returns An array of aggregated score-buckets in descending score order (based on first occurrence).
 */
export function dedupeAndAggregate(
  items: QdrantSearchResponses,
  opts?: { scorePrecision?: number },
): Array<DedupedAggregatedPayload> {
  const precision = opts?.scorePrecision ?? 4;
  const aggregation = new Map<string, DedupedAggregatedPayload>();

  for (const item of items.flat().sort(byScoreThenVersionDesc)) {
    const key = scoreKey(item.score, precision);
    const agg =
      aggregation.get(key) ??
      (() => {
        const v: DedupedAggregatedPayload = {
          sharedPayloadIds: [],
          matches: [],
        };
        aggregation.set(key, v);
        return v;
      })();

    agg.matches.push(item);

    const pid = payloadIdOf(item);
    if (pid !== undefined && pid !== null)
      agg.sharedPayloadIds.push(String(pid));
  }

  for (const agg of aggregation.values())
    agg.sharedPayloadIds = [...new Set(agg.sharedPayloadIds)];

  return [...aggregation.values()];
}
