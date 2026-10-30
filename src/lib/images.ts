/**
 * All photography is bundled with the site: files live in `public/images/` and
 * the data files reference them by root-absolute path (`/images/properties/…`).
 *
 * `BASE_URL` is "/" in dev and "/<repo>/" on a GitHub Pages project site, so
 * prefixing it keeps every local asset reachable in both. Absolute URLs are
 * returned untouched.
 */
const BASE = import.meta.env.BASE_URL;

export function imageUrl(src: string): string {
  if (!src) return '';
  return src.startsWith('/') ? `${BASE}${src.slice(1)}` : src;
}
