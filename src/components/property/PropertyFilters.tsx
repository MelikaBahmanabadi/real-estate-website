import type { ReactNode } from 'react';
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';
import { locations, propertyTypes } from '../../data/site';

export interface FilterState {
  q: string;
  location: string;
  type: string;
  maxPrice: string;
  beds: string;
  baths: string;
  sort: string;
}

export const defaultFilters: FilterState = {
  q: '',
  location: '',
  type: '',
  maxPrice: '',
  beds: '',
  baths: '',
  sort: 'featured',
};

export function countActiveFilters(filters: FilterState): number {
  return [filters.q, filters.location, filters.type, filters.maxPrice, filters.beds, filters.baths].filter(
    Boolean,
  ).length;
}

interface FieldProps {
  label: string;
  htmlFor: string;
  className?: string;
  children: ReactNode;
}

function Field({ label, htmlFor, className = '', children }: FieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const selectClass =
  'h-11 w-full appearance-none rounded-[2px] border border-line bg-white pl-3 pr-9 text-[13.5px] text-navy transition-colors duration-300 hover:border-navy/30 focus:border-navy focus:outline-none';

interface PropertyFiltersProps {
  filters: FilterState;
  onChange: (patch: Partial<FilterState>) => void;
  onReset: () => void;
  resultCount: number;
  expanded: boolean;
  onToggleExpanded: () => void;
}

const priceOptions = [
  { value: '2000000', label: 'Up to $2M' },
  { value: '3000000', label: 'Up to $3M' },
  { value: '4000000', label: 'Up to $4M' },
  { value: '5000000', label: 'Up to $5M' },
  { value: '7000000', label: 'Up to $7M' },
  { value: '10000000', label: 'Up to $10M' },
];

export function PropertyFilters({
  filters,
  onChange,
  onReset,
  resultCount,
  expanded,
  onToggleExpanded,
}: PropertyFiltersProps) {
  const activeCount = countActiveFilters(filters);

  return (
    <section aria-label="Property search and filters" className="rounded-card border border-line bg-white p-4 sm:p-5 lg:p-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
        <Field label="Search" htmlFor="filter-search" className="sm:col-span-2 lg:col-span-6">
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              strokeWidth={1.6}
            />
            <input
              id="filter-search"
              type="search"
              value={filters.q}
              onChange={(event) => onChange({ q: event.target.value })}
              placeholder="Search name, city or area"
              className="h-11 w-full rounded-[2px] border border-line bg-white pl-10 pr-3 text-[13.5px] text-navy placeholder:text-muted/70 transition-colors duration-300 hover:border-navy/30 focus:border-navy focus:outline-none"
            />
          </div>
        </Field>

        <Field label="Location" htmlFor="filter-location" className="lg:col-span-3">
          <div className="relative">
            <select
              id="filter-location"
              value={filters.location}
              onChange={(event) => onChange({ location: event.target.value })}
              className={selectClass}
            >
              <option value="">All locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
              strokeWidth={1.8}
            />
          </div>
        </Field>

        <Field label="Sort by" htmlFor="filter-sort" className="lg:col-span-3">
          <div className="relative">
            <select
              id="filter-sort"
              value={filters.sort}
              onChange={(event) => onChange({ sort: event.target.value })}
              className={selectClass}
            >
              <option value="featured">Featured first</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="beds-desc">Most bedrooms</option>
              <option value="newest">Newest build</option>
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
              strokeWidth={1.8}
            />
          </div>
        </Field>

        <button
          type="button"
          onClick={onToggleExpanded}
          aria-expanded={expanded}
          aria-controls="advanced-filters"
          className="inline-flex h-11 items-center justify-center gap-2 self-end rounded-[2px] border border-navy/20 px-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-navy transition-colors duration-300 hover:border-navy hover:bg-navy hover:text-white lg:hidden"
        >
          <SlidersHorizontal aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />
          Filters{activeCount > 0 ? ` (${activeCount})` : ''}
        </button>

        <div
          id="advanced-filters"
          className={`col-span-1 grid grid-cols-1 gap-3 sm:col-span-2 sm:grid-cols-2 lg:col-span-12 lg:grid-cols-12 ${
            expanded ? '' : 'hidden lg:grid'
          }`}
        >
          <Field label="Property type" htmlFor="filter-type" className="lg:col-span-3">
            <div className="relative">
              <select
                id="filter-type"
                value={filters.type}
                onChange={(event) => onChange({ type: event.target.value })}
                className={selectClass}
              >
                <option value="">All types</option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
                strokeWidth={1.8}
              />
            </div>
          </Field>

          <Field label="Price range" htmlFor="filter-price" className="lg:col-span-3">
            <div className="relative">
              <select
                id="filter-price"
                value={filters.maxPrice}
                onChange={(event) => onChange({ maxPrice: event.target.value })}
                className={selectClass}
              >
                <option value="">Any price</option>
                {priceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
                strokeWidth={1.8}
              />
            </div>
          </Field>

          <Field label="Bedrooms" htmlFor="filter-beds" className="lg:col-span-3">
            <div className="relative">
              <select
                id="filter-beds"
                value={filters.beds}
                onChange={(event) => onChange({ beds: event.target.value })}
                className={selectClass}
              >
                <option value="">Any</option>
                {[2, 3, 4, 5, 6].map((count) => (
                  <option key={count} value={String(count)}>
                    {count}+ bedrooms
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
                strokeWidth={1.8}
              />
            </div>
          </Field>

          <Field label="Bathrooms" htmlFor="filter-baths" className="lg:col-span-3">
            <div className="relative">
              <select
                id="filter-baths"
                value={filters.baths}
                onChange={(event) => onChange({ baths: event.target.value })}
                className={selectClass}
              >
                <option value="">Any</option>
                {[2, 3, 4, 5].map((count) => (
                  <option key={count} value={String(count)}>
                    {count}+ bathrooms
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
                strokeWidth={1.8}
              />
            </div>
          </Field>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <p aria-live="polite" className="text-[12.5px] text-muted">
          <span className="font-semibold text-navy">{resultCount}</span>{' '}
          {resultCount === 1 ? 'property' : 'properties'} available
        </p>
        <button
          type="button"
          onClick={onReset}
          disabled={activeCount === 0}
          className="inline-flex min-h-9 items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-navy transition-colors duration-300 hover:text-champagne-deep disabled:cursor-not-allowed disabled:text-muted/40"
        >
          <X aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.8} />
          Clear filters
        </button>
      </div>
    </section>
  );
}
