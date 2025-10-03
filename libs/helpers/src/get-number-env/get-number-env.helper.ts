export function getNumberEnv(
  value?: string | null,
  fallback?: number,
): number | null {
  if (value === undefined || value === null) return fallback ?? null;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? (fallback ?? null) : parsed;
}
