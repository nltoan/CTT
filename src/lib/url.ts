export function buildQueryString(base: {
  page?: number;
  category?: string | null;
  tag?: string | null;
  q?: string | null;
  level?: string | null;
}) {
  const params = new URLSearchParams();
  if (base.category) {
    params.set('category', base.category);
  }
  if (base.tag) {
    params.set('tag', base.tag);
  }
  if (base.level) {
    params.set('level', base.level);
  }
  if (base.q) {
    params.set('q', base.q);
  }
  if (base.page && base.page > 1) {
    params.set('page', String(base.page));
  }
  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}
