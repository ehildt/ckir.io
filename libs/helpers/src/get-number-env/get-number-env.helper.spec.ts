import { getNumberEnv } from './get-number-env.helper';

describe('getNumberEnv', () => {
  test('parses a valid number string', () => {
    expect(getNumberEnv('42')).toBe(42);
  });

  test('parses a valid negative number string', () => {
    expect(getNumberEnv('-10')).toBe(-10);
  });

  test('returns NaN fallback when value is not a number', () => {
    expect(getNumberEnv('abc', 5)).toBe(5);
  });

  test('returns null when value is undefined and fallback is not provided', () => {
    expect(getNumberEnv(undefined)).toBeNull();
  });

  test('returns fallback when value is undefined', () => {
    expect(getNumberEnv(undefined, 100)).toBe(100);
  });

  test('returns fallback when value is null', () => {
    expect(getNumberEnv(null, 200)).toBe(200);
  });

  test('returns null when the value is non-numeric and no fallback is provided', () => {
    expect(getNumberEnv('abc')).toBeNull();
  });
});
