// Shared by the yield table, digest prompt, and digest UI — anywhere a
// count like "1 runs" would read as sloppy copy.
export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
