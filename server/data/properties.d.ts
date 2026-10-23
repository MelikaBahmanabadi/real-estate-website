import type { Agent, Property } from '../../src/types';

/** Catalogue entries as authored; the API adds `location` and `agent`. */
export type CatalogueEntry = Omit<Property, 'location' | 'agent'>;

export declare const agents: Agent[];
export declare const properties: CatalogueEntry[];
