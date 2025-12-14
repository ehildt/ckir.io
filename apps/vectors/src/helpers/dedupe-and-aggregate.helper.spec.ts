import {
  dedupeAndAggregate,
  DedupedAggregatedPayload,
} from './dedupe-and-aggregate.helper';

describe('dedupeAndAggregate', () => {
  it('aggregates items by score and deduplicates ids correctly', () => {
    const input = [
      [
        { id: 't1', score: 0.95, version: 1, payload: { id: 'a' } },
        { id: 't1', score: 0.95, version: 2, payload: { id: 'b' } },
      ],
      [
        { id: 't1', score: 0.9, version: 1, payload: { id: 'a' } },
        { id: 't1', score: 0.9, version: 2, payload: { id: 'c' } },
        { id: 't1', score: 0.95, version: 3, payload: { id: 'a' } },
      ],
    ];

    const result: DedupedAggregatedPayload[] = dedupeAndAggregate(input);

    // Check score group 0.95
    expect(result[0].sharedPayloadIds.sort()).toEqual(['a', 'b']);
    expect(result[0].matches).toEqual([
      { id: 't1', score: 0.95, version: 3, payload: { id: 'a' } },
      { id: 't1', score: 0.95, version: 2, payload: { id: 'b' } },
      { id: 't1', score: 0.95, version: 1, payload: { id: 'a' } },
    ]);

    // Check score group 0.9
    expect(result[1].sharedPayloadIds.sort()).toEqual(['a', 'c']);
    expect(result[1].matches).toEqual([
      { id: 't1', score: 0.9, version: 2, payload: { id: 'c' } },
      { id: 't1', score: 0.9, version: 1, payload: { id: 'a' } },
    ]);
  });

  it('returns empty array for empty input', () => {
    expect(dedupeAndAggregate([])).toEqual([]);
  });
});
