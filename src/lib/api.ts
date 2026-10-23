import type { InquiryPayload, Property } from '../types';

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

export async function fetchProperties(): Promise<Property[]> {
  const data = await request<{ properties: Property[] }>('/api/properties');
  return data.properties;
}

export async function fetchProperty(slug: string): Promise<Property> {
  const data = await request<{ property: Property }>(`/api/properties/${encodeURIComponent(slug)}`);
  return data.property;
}

export async function submitInquiry(payload: InquiryPayload): Promise<void> {
  await request<{ ok: boolean }>('/api/inquiries', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function subscribeToNewsletter(email: string): Promise<void> {
  await request<{ ok: boolean; alreadySubscribed?: boolean }>('/api/newsletter', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}
