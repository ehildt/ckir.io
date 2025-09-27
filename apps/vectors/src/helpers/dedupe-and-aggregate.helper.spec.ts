import { QdrantSearchResponses } from '@ckir.io/qdrant';

import { dedupeAndAggregate } from './dedupe-and-aggregate.helper';

describe('dedupeAndAggregate', () => {
  it('deduplicates and aggregates items by score', () => {
    const items: QdrantSearchResponses = [
      [
        { id: 'a', version: 1, score: 0.95, payload: { id: 'a' } },
        { id: 'b', version: 1, score: 0.95, payload: { id: 'b' } },
      ],
      [{ id: 'c', version: 1, score: 0.9, payload: { id: 'c' } }],
    ];

    const result = dedupeAndAggregate(items);

    expect(result).toHaveLength(2);

    // First group: score 0.95
    expect(result[0].ids).toEqual(['a', 'b']);
    expect(result[0].matches.map((m: any) => m.id)).toEqual(['a', 'b']);

    // Second group: score 0.9
    expect(result[1].ids).toEqual(['c']);
    expect(result[1].matches.map((m: any) => m.id)).toEqual(['c']);
  });

  it('handles empty input', () => {
    const result = dedupeAndAggregate([]);
    expect(result).toEqual([]);
  });

  it('sorts descending by score', () => {
    const items: QdrantSearchResponses = [
      [
        { id: 'x', version: 1, score: 0.1, payload: { id: 'x' } },
        { id: 'y', version: 1, score: 0.5, payload: { id: 'y' } },
      ],
    ];
    const result = dedupeAndAggregate(items);
    expect(result[0].ids).toEqual(['y']);
    expect(result[1].ids).toEqual(['x']);
  });
});
