import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import { PageMasthead } from '../components/ui/PageMasthead';
import { Button } from '../components/ui/Button';
import { PropertyCard } from '../components/property/PropertyCard';
import {
  PropertyFilters,
  defaultFilters,
  type FilterState,
} from '../components/property/PropertyFilters';
import { useProperties } from '../hooks/useProperties';
import { usePageTitle } from '../hooks';

const FILTER_KEYS: (keyof FilterState)[] = [
  'q',
  'location',
  'type',
  'maxPrice',
  'beds',
  'baths',
  'sort',
];

export default function PropertiesPage() {
  usePageTitle('Properties');
  const [searchParams, setSearchParams] = useSearchParams();
  const [expanded, setExpanded] = useState(false);
  const { properties, loading, error } = useProperties();

  const filters = useMemo<FilterState>(() => {
    const next = { ...defaultFilters };
    FILTER_KEYS.forEach((key) => {
      const value = searchParams.get(key);
      if (value) {
        next[key] = value;
      }
    });
    return next;
  }, [searchParams]);

  const updateFilters = (patch: Partial<FilterState>) => {
    const merged: FilterState = { ...filters, ...patch };
    const params = new URLSearchParams();
    FILTER_KEYS.forEach((key) => {
      const value = merged[key];
      if (value && !(key === 'sort' && value === 'featured')) {
        params.set(key, value);
      }
    });
    setSearchParams(params, { replace: true });
  };

  const resetFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const results = useMemo(() => {
    let list = properties ?? [];
    const query = filters.q.trim().toLowerCase();

    if (query) {
      list = list.filter((property) =>
        [property.name, property.city, property.region, property.type, property.location]
          .join(' ')
          .toLowerCase()
          .includes(query),
      );
    }

    if (filters.location) {
      const [city, region] = filters.location.split(', ');
      list = list.filter((property) => property.city === city && property.region === region);
    }

    if (filters.type) {
      list = list.filter((property) => property.type === filters.type);
    }

    if (filters.maxPrice) {
      const max = Number(filters.maxPrice);
      list = list.filter((property) => property.price <= max);
    }

    if (filters.beds) {
      const beds = Number(filters.beds);
      list = list.filter((property) => property.beds >= beds);
    }

    if (filters.baths) {
      const baths = Number(filters.baths);
      list = list.filter((property) => property.baths >= baths);
    }

    const sorted = [...list];
    switch (filters.sort) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'beds-desc':
        sorted.sort((a, b) => b.beds - a.beds);
        break;
      case 'newest':
        sorted.sort((a, b) => b.year - a.year);
        break;
      default:
        sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || b.price - a.price);
    }

    return sorted;
  }, [properties, filters]);

  const total = properties?.length ?? 0;

  return (
    <>
      <PageMasthead
        label="Portfolio"
        title="Properties"
        intro={`A considered register of ${total || 'ten'} residences and estates across the United States. Filter by location, type and budget — or speak to an advisor about homes that never reach the open market.`}
      />

      <section aria-label="Property catalogue" className="section bg-white">
        <div className="shell">
          <PropertyFilters
            filters={filters}
            onChange={updateFilters}
            onReset={resetFilters}
            resultCount={results.length}
            expanded={expanded}
            onToggleExpanded={() => setExpanded((value) => !value)}
          />

          <div className="mt-10 lg:mt-12">
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8" aria-hidden="true">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="aspect-[4/5] animate-pulse rounded-card bg-ivory-deep"
                  />
                ))}
              </div>
            ) : null}

            {error && !loading ? (
              <div className="rounded-card border border-line bg-ivory px-6 py-14 text-center">
                <p className="text-[15px] text-muted">{error}</p>
                <Button variant="outline" className="mt-6" onClick={() => window.location.reload()}>
                  Try again
                </Button>
              </div>
            ) : null}

            {!loading && !error && results.length > 0 ? (
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {results.map((property, index) => (
                  <li key={property.id}>
                    <PropertyCard
                      property={property}
                      priority={index < 3}
                      sizes="(min-width: 1024px) 31vw, (min-width: 640px) 47vw, 92vw"
                    />
                  </li>
                ))}
              </ul>
            ) : null}

            {!loading && !error && results.length === 0 ? (
              <div className="rounded-card border border-line bg-ivory px-6 py-16 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-champagne-deep">
                  <SearchX aria-hidden="true" className="h-6 w-6" strokeWidth={1.5} />
                </span>
                <h2 className="mt-5 text-[22px] font-semibold text-navy">No properties match yet</h2>
                <p className="mx-auto mt-2 max-w-sm text-[14.5px] leading-relaxed text-muted">
                  Try widening the price range or removing a filter. Our advisors also hold a
                  private register of off-market homes.
                </p>
                <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                  <Button variant="outline" onClick={resetFilters}>
                    Clear filters
                  </Button>
                  <a
                    href="mailto:hello@horizonproperties.com"
                    className="inline-flex min-h-12 items-center text-[11.5px] font-semibold uppercase tracking-[0.15em] text-navy transition-colors hover:text-champagne-deep"
                  >
                    Ask an advisor
                  </a>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
