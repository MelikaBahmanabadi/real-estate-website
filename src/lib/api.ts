import { catalogue, findProperty } from '../data/catalogue';
import { site } from '../data/site';
import type { InquiryPayload, Property } from '../types';

/**
 * `VITE_STATIC_BUILD=1` (`npm run build:static`) produces a site for hosts with
 * no server — GitHub Pages, Netlify static, an S3 bucket. The catalogue is
 * bundled instead of fetched, and the forms open the visitor's mail client with
 * the details prefilled. `npm run build` keeps the Express API in charge.
 */
const STATIC_BUILD = import.meta.env.VITE_STATIC_BUILD === '1';

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  const data = (await response.json().catch(() => null)) as
    | (T & { error?: string })
    | null;

  if (!response.ok) {
    throw new Error(data?.error || 'Something went wrong. Please try again.');
  }

  return data as T;
}

/** Static builds have no inbox of their own: hand the message to the mail app. */
function openMail(subject: string, lines: Array<string | null | undefined>) {
  const body = lines.filter((line): line is string => Boolean(line)).join('\n');
  window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}

export async function fetchProperties(): Promise<Property[]> {
  if (STATIC_BUILD) return catalogue;
  const data = await request<{ properties: Property[] }>('/api/properties');
  return data.properties;
}

export async function fetchProperty(slug: string): Promise<Property> {
  if (STATIC_BUILD) {
    const property = findProperty(slug);
    if (!property) throw new Error('Property not found');
    return property;
  }
  const data = await request<{ property: Property }>(`/api/properties/${encodeURIComponent(slug)}`);
  return data.property;
}

export async function submitInquiry(payload: InquiryPayload): Promise<void> {
  if (STATIC_BUILD) {
    const subject =
      payload.kind === 'viewing'
        ? 'Viewing request'
        : payload.kind === 'agent'
          ? 'Property enquiry'
          : 'Website enquiry';
    openMail(`${subject} — ${payload.name}`, [
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      payload.phone ? `Phone: ${payload.phone}` : null,
      payload.propertySlug ? `Property: ${payload.propertySlug}` : null,
      payload.preferredDate ? `Preferred date: ${payload.preferredDate}` : null,
      '',
      payload.message,
    ]);
    return;
  }

  await request<{ ok: boolean }>('/api/inquiries', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function subscribeToNewsletter(email: string): Promise<void> {
  if (STATIC_BUILD) {
    openMail('Newsletter signup', [`Please add ${email} to the Horizon Properties newsletter.`]);
    return;
  }

  await request<{ ok: boolean; alreadySubscribed?: boolean }>('/api/newsletter', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}
