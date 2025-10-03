export function slugify(input: string) {
  if (!input) {
    return '';
  }
  const normalized = input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase();
  return normalized
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

export function ensureSlug(input: string, fallback: string) {
  const slug = slugify(input);
  return slug || fallback;
}
