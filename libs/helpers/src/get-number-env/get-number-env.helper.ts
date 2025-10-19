/**
 * Parses an environment variable value into a number.
 *
 * @param {string | null | undefined} value - The environment variable value to parse.
 * @param {number} [fallback] - A fallback value to return if parsing fails or the value is undefined/null.
 * @returns {number | null} The parsed number, the fallback value, or null if parsing fails and no fallback is provided.
 */
export function getNumberEnv(
  value?: string | null,
  fallback?: number,
): number | null {
  if (value === undefined || value === null) return fallback ?? null;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? (fallback ?? null) : parsed;
}
