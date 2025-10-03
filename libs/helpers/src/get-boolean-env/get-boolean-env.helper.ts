export function getBooleanEnv(
  value?: string | null,
  fallback?: boolean,
): boolean | null {
  if (value === undefined || value === null) return fallback ?? null;
  return value.startsWith('true');
}
