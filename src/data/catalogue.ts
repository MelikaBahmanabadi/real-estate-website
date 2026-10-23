import type { Agent, Property } from '../types';
import { agents, properties } from '../../server/data/properties.js';

/**
 * The same catalogue the Express API serves, bundled for builds that have no
 * server (GitHub Pages). `server/data/properties.js` stays the single source of
 * truth; this only reproduces the enrichment the API does.
 */
const agentById = new Map<string, Agent>(agents.map((agent) => [agent.id, agent] as const));

export const catalogue: Property[] = properties.map((property) => ({
  ...property,
  location: `${property.city}, ${property.region}, ${property.country}`,
  agent: agentById.get(property.agentId) ?? null,
}));

export function findProperty(slug: string): Property | undefined {
  return catalogue.find((property) => property.slug === slug);
}
