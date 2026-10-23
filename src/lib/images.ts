const UNSPLASH_HOST = 'https://images.unsplash.com/';

/**
 * Build a responsive URL for a photo. Unsplash URLs accept width/quality
 * params; any other host (local assets, a future CDN) is returned untouched.
 */
export function imageUrl(src: string, width: number, quality = 78): string {
  if (!src) return '';
  if (!src.startsWith(UNSPLASH_HOST)) return src;
  const base = src.split('?')[0];
  return `${base}?auto=format&fit=crop&w=${width}&q=${quality}`;
}

export function imageSrcSet(src: string, widths: number[] = [480, 800, 1200, 1600]): string {
  if (!src.startsWith(UNSPLASH_HOST)) return '';
  return widths.map((width) => `${imageUrl(src, width)} ${width}w`).join(', ');
}

export const CARD_IMAGE_WIDTHS = [400, 640, 900];
