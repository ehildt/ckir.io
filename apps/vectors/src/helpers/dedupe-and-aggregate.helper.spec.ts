import { QdrantSearchResponses } from '@ehildt/ckir-qdrant';

import {
  dedupeAndAggregate,
  DedupedAggregatedPayload,
} from './dedupe-and-aggregate.helper';

type Match = QdrantSearchResponses[number][number];

const m = (
  partial: Partial<Match> & Pick<Match, 'id' | 'score' | 'version'>,
): Match =>
  ({
    payload: null,
    ...partial,
  }) as Match;

describe('dedupeAndAggregate', () => {
  test('groups matches by score key with default precision (4)', () => {
    const input: QdrantSearchResponses = [
      [
        m({ id: 'a', score: 0.123456, version: 1 }),
        m({ id: 'b', score: 0.123454, version: 1 }),
      ],
    ];

    const result = dedupeAndAggregate(input);

    expect(result).toHaveLength(1);
    expect(result[0].matches.map((m) => m.id)).toEqual(['a', 'b']);
  });

  test('groups matches by score key using custom precision', () => {
    const input: QdrantSearchResponses = [
      [
        m({ id: 'a', score: 0.123456, version: 1 }),
        m({ id: 'b', score: 0.123454, version: 1 }),
      ],
    ];

    const result = dedupeAndAggregate(input, { scorePrecision: 3 });

    expect(result).toHaveLength(1);
    expect(result[0].matches.map((m) => m.id)).toEqual(['a', 'b']);
  });

  test('sorts by score desc, then version desc before aggregation', () => {
    const input: QdrantSearchResponses = [
      [
        m({ id: 'a', score: 0.5, version: 1 }),
        m({ id: 'b', score: 0.6, version: 1 }),
        m({ id: 'c', score: 0.6, version: 2 }),
      ],
    ];

    const result = dedupeAndAggregate(input);

    expect(result[0].matches.map((m) => m.id)).toEqual(['c', 'b']);
    expect(result[1].matches.map((m) => m.id)).toEqual(['a']);
  });

  test('deduplicates matches by match id within the same score bucket', () => {
    const input: QdrantSearchResponses = [
      [
        m({ id: 'a', score: 0.5, version: 1 }),
        m({ id: 'a', score: 0.5, version: 2 }),
      ],
    ];

    const result = dedupeAndAggregate(input);

    expect(result).toHaveLength(1);
    expect(result[0].matches).toHaveLength(1);
    expect(result[0].matches[0].version).toBe(2);
  });

  test('aggregates payload ids and deduplicates them', () => {
    const input: QdrantSearchResponses = [
      [
        m({
          id: 'a',
          score: 0.5,
          version: 1,
          payload: { id: 'p1' },
        }),
        m({
          id: 'b',
          score: 0.5,
          version: 1,
          payload: { id: 'p1' },
        }),
        m({
          id: 'c',
          score: 0.5,
          version: 1,
          payload: { id: 'p2' },
        }),
      ],
    ];

    const result = dedupeAndAggregate(input);

    expect(result[0].aggregatedPayloadIds.sort()).toEqual(['p1', 'p2']);
  });

  test('ignores null or undefined payload ids', () => {
    const input: QdrantSearchResponses = [
      [
        m({
          id: 'a',
          score: 0.5,
          version: 1,
          payload: { id: null },
        }),
        m({
          id: 'b',
          score: 0.5,
          version: 1,
          payload: {},
        }),
      ],
    ];

    const result = dedupeAndAggregate(input);

    expect(result[0].aggregatedPayloadIds).toEqual([]);
  });

  test('flattens multiple response arrays before processing', () => {
    const input: QdrantSearchResponses = [
      [m({ id: 'a', score: 0.5, version: 1 })],
      [m({ id: 'b', score: 0.5, version: 1 })],
    ];

    const result = dedupeAndAggregate(input);

    expect(result).toHaveLength(1);
    expect(result[0].matches.map((m) => m.id).sort()).toEqual(['a', 'b']);
  });

  test('does not leak internal aggregation state', () => {
    const input: QdrantSearchResponses = [
      [m({ id: 'a', score: 0.5, version: 1 })],
    ];

    const result = dedupeAndAggregate(input) as Array<
      DedupedAggregatedPayload & { _matchIds?: unknown }
    >;

    expect(result[0]._matchIds).toBeUndefined();
  });

  test('returns empty array for empty input', () => {
    const result = dedupeAndAggregate([]);

    expect(result).toEqual([]);
  });
});
