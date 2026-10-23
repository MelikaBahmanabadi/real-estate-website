/** "$2.35 Million" — the editorial price format used throughout the site. */
export function formatPriceShort(price: number): string {
  if (price >= 1_000_000) {
    const millions = price / 1_000_000;
    return `$${millions.toFixed(2).replace(/\.?0+$/, '')} Million`;
  }
  if (price >= 1_000) {
    return `$${Math.round(price / 1_000)}K`;
  }
  return `$${price.toLocaleString('en-US')}`;
}

/** "$2,350,000" */
export function formatPriceFull(price: number): string {
  return `$${price.toLocaleString('en-US')}`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString('en-US');
}

export function formatPhoneHref(phone: string): string {
  return `tel:+1${phone.replace(/\D/g, '')}`;
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
