export function fileComparator(fA: File | File[], fB: File | File[]): boolean {
  const aFiles = Array.isArray(fA) ? fA : [fA];
  const bFiles = Array.isArray(fB) ? fB : [fB];
  return aFiles.some((a) =>
    bFiles.some((b) => a.name === b.name && a.type === b.type && a.lastModified === b.lastModified),
  );
}
