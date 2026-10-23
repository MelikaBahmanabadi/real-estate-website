export type PropertyType =
  | 'Villa'
  | 'Estate'
  | 'Residence'
  | 'Penthouse'
  | 'House'
  | 'Townhouse';

export interface Agent {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  image: string;
}

export interface Property {
  id: string;
  slug: string;
  name: string;
  city: string;
  region: string;
  country: string;
  location: string;
  type: PropertyType;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  lot: string | null;
  year: number;
  status: string;
  featured: boolean;
  tagline: string;
  description: string[];
  features: string[];
  amenities: string[];
  images: string[];
  agentId: string;
  agent: Agent | null;
}

export interface InquiryPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
  propertySlug?: string | null;
  kind: 'agent' | 'viewing' | 'contact';
  preferredDate?: string | null;
}
