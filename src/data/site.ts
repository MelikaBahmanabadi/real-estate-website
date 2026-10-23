export const site = {
  name: 'Horizon Properties',
  tagline: 'Exceptional homes & investments',
  phone: '(555) 246-7890',
  phoneAlt: '(555) 246-7891',
  email: 'hello@horizonproperties.com',
  address: {
    line1: '1420 Westlake Avenue, Suite 900',
    line2: 'Austin, Texas 78701',
  },
  hours: [
    { days: 'Monday — Friday', time: '9:00 — 18:00' },
    { days: 'Saturday', time: 'By appointment' },
  ],
  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { label: 'Facebook', href: 'https://www.facebook.com/' },
  ],
};

export const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Properties', to: '/properties' },
  { label: 'About Us', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Team', to: '/team' },
  { label: 'Contact', to: '/contact' },
];

export interface Service {
  index: string;
  title: string;
  summary: string;
  detail: string;
}

export const services: Service[] = [
  {
    index: '01',
    title: 'Luxury Home Sales',
    summary: 'Representation for architecturally significant homes, from first viewing to closing.',
    detail:
      'We take on a limited number of listings each year so every home receives a considered marketing campaign, a vetted buyer list and an advisor who knows the property intimately.',
  },
  {
    index: '02',
    title: 'Property Investment',
    summary: 'Acquisition strategy for income-producing and capital-growth residential assets.',
    detail:
      'Yield modelling, neighbourhood analysis and off-market sourcing, delivered with the same discretion we apply to private residences.',
  },
  {
    index: '03',
    title: 'Property Marketing',
    summary: 'Editorial photography, film and print campaigns built around the architecture.',
    detail:
      'A dedicated creative team produces the photography, film and printed material that position a property in the right company.',
  },
  {
    index: '04',
    title: 'Real Estate Advisory',
    summary: 'Independent counsel on portfolio structure, timing and long-term holdings.',
    detail:
      'For families and funds holding multiple residences, we advise on acquisition timing, structuring and the quiet exit of assets.',
  },
  {
    index: '05',
    title: 'Property Valuation',
    summary: 'Confident, evidence-led valuations for sale, estate planning and lending.',
    detail:
      'Comparative analysis grounded in recorded transactions and direct market intelligence, prepared for lenders, trustees and courts.',
  },
  {
    index: '06',
    title: 'Relocation Services',
    summary: 'A single point of contact for moving a household across states or oceans.',
    detail:
      'Schooling, staffing, insurance and interior completion — coordinated quietly around the dates that matter to you.',
  },
];

export const whyChoose = [
  {
    index: '01',
    title: 'Discretion by default',
    body: 'Most of what we sell is never advertised. Our clients hear about it first, in confidence.',
  },
  {
    index: '02',
    title: 'Access to off-market stock',
    body: 'A private register of owners who will consider a sale when the right buyer appears.',
  },
  {
    index: '03',
    title: 'One advisor, end to end',
    body: 'The person who shows you the house is the person who negotiates and closes it.',
  },
  {
    index: '04',
    title: 'Investment-grade insight',
    body: 'Every recommendation is supported by evidence: comparables, absorption and holding costs.',
  },
];

export const stats = [
  { value: '22', suffix: 'yrs', label: 'Advisory practice' },
  { value: '$2.4', suffix: 'B', label: 'Residential sales' },
  { value: '1,200', suffix: '+', label: 'Families advised' },
  { value: '96', suffix: '%', label: 'Client referrals' },
];

export const values = [
  {
    title: 'Integrity',
    body: 'We tell clients what we would tell a friend — including when the answer is to wait.',
  },
  {
    title: 'Transparency',
    body: 'Clear fees, honest valuations and full disclosure of every material detail.',
  },
  {
    title: 'Craft',
    body: 'Architecture deserves representation that matches its ambition. We are exacting about it.',
  },
  {
    title: 'Stewardship',
    body: 'A home is a long-term holding. We advise for the decade, not the quarter.',
  },
];

export const team = [
  {
    name: 'Daniel Morgan',
    role: 'Managing Director',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    email: 'daniel@horizonproperties.com',
    phone: '(555) 246-7890',
    bio: 'Twenty-two years in residential brokerage, with a focus on architect-designed homes and private estates.',
  },
  {
    name: 'Olivia Carter',
    role: 'Luxury Property Advisor',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
    email: 'olivia@horizonproperties.com',
    phone: '(555) 246-7891',
    bio: 'Represents buyers and sellers across the Californian coast, from Malibu to Big Sur.',
  },
  {
    name: 'James Wilson',
    role: 'Investment Consultant',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a',
    email: 'james@horizonproperties.com',
    phone: '(555) 246-7892',
    bio: 'Advises private clients and family offices on residential investment strategy and portfolio timing.',
  },
  {
    name: 'Sophia Bennett',
    role: 'Senior Property Specialist',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956',
    email: 'sophia@horizonproperties.com',
    phone: '(555) 246-7893',
    bio: 'Specialises in waterfront and city residences, with a background in interior architecture.',
  },
];

export const processSteps = [
  {
    index: '01',
    title: 'Conversation',
    body: 'We start with what you actually need — a home, a holding, a horizon — and the constraints around it.',
  },
  {
    index: '02',
    title: 'Curation',
    body: 'A shortlist of five properties, not fifty. Each one visited and assessed before it reaches you.',
  },
  {
    index: '03',
    title: 'Negotiation',
    body: 'Evidence-led offers, quiet negotiation and a clear read on where the market will move next.',
  },
  {
    index: '04',
    title: 'Completion',
    body: 'Survey, legal and finance coordinated by your advisor through to the day you receive the keys.',
  },
];

export const propertyTypes = ['Villa', 'Estate', 'Residence', 'Penthouse', 'House', 'Townhouse'];

export const locations = [
  'Austin, Texas',
  'Malibu, California',
  'Scottsdale, Arizona',
  'Miami, Florida',
  'Los Angeles, California',
  'Beverly Hills, California',
  'Lake Tahoe, Nevada',
  'Big Sur, California',
  'Charleston, South Carolina',
];
