export function getBooleanEnv(value?: string | null, fallback?: boolean): boolean | null {
  if (value === undefined || value === null) return fallback ?? null;
  return value.startsWith('true');
}

export function getNumberEnv(value?: string | null, fallback?: number): number | null {
  if (value === undefined || value === null) return fallback ?? null;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? (fallback ?? null) : parsed;
}
