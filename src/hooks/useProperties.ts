import { useEffect, useState } from 'react';
import type { Property } from '../types';
import { fetchProperties } from '../lib/api';

let cachedProperties: Property[] | null = null;
let pendingRequest: Promise<Property[]> | null = null;

export function useProperties() {
  const [properties, setProperties] = useState<Property[] | null>(cachedProperties);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!cachedProperties);

  useEffect(() => {
    if (cachedProperties) return;
    let active = true;

    setLoading(true);
    pendingRequest = pendingRequest ?? fetchProperties();

    pendingRequest
      .then((data) => {
        cachedProperties = data;
        if (active) {
          setProperties(data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        pendingRequest = null;
        if (active) {
          setError(err instanceof Error ? err.message : 'Unable to load properties.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { properties, loading, error };
}
