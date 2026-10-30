import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BedDouble,
  CalendarDays,
  Check,
  ChevronRight,
  Heart,
  Maximize,
  MapPin,
  Phone,
  Sparkles,
  Bath,
} from 'lucide-react';
import { Button, ButtonLink } from '../components/ui/Button';
import { SectionLabel } from '../components/ui/SectionLabel';
import { PropertyGallery } from '../components/property/PropertyGallery';
import { PropertyCard } from '../components/property/PropertyCard';
import { InquiryDialog } from '../components/forms/InquiryDialog';
import { useProperties } from '../hooks/useProperties';
import { useFavorites } from '../context/FavoritesContext';
import { fetchProperty } from '../lib/api';
import { formatNumber, formatPhoneHref, formatPriceFull, formatPriceShort } from '../lib/format';
import { imageUrl } from '../lib/images';
import { usePageTitle } from '../hooks';
import type { Property } from '../types';

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; property: Property };

export default function PropertyDetailPage() {
  const { slug = '' } = useParams();
  const [state, setState] = useState<LoadState>({ status: 'loading' });
  const [dialog, setDialog] = useState<'agent' | 'viewing' | null>(null);
  const { properties } = useProperties();
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    let active = true;
    setState({ status: 'loading' });

    fetchProperty(slug)
      .then((property) => {
        if (active) setState({ status: 'ready', property });
      })
      .catch((error: unknown) => {
        if (active) {
          setState({
            status: 'error',
            message: error instanceof Error ? error.message : 'Property not found.',
          });
        }
      });

    return () => {
      active = false;
    };
  }, [slug]);

  const property = state.status === 'ready' ? state.property : null;
  usePageTitle(property ? property.name : 'Property');

  useEffect(() => {
    setDialog(null);
  }, [slug]);

  if (state.status === 'loading') {
    return (
      <div className="shell pb-24 pt-[calc(var(--header-height)+40px)]">
        <div className="h-4 w-52 animate-pulse rounded bg-ivory-deep" />
        <div className="mt-8 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="aspect-[16/10] animate-pulse rounded-card bg-ivory-deep" />
            <div className="mt-4 flex gap-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-16 w-[19%] animate-pulse rounded bg-ivory-deep" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-4">
            <div className="h-80 animate-pulse rounded-card bg-ivory-deep" />
          </div>
        </div>
      </div>
    );
  }

  if (state.status === 'error' || !property) {
    return (
      <div className="shell flex min-h-[70vh] flex-col items-center justify-center pb-24 pt-[calc(var(--header-height)+40px)] text-center">
        <p className="label">Not found</p>
        <h1 className="display mt-4">This residence is no longer listed</h1>
        <p className="body-copy mt-4 max-w-md">
          It may have been sold or withdrawn from the open market. Our advisors can suggest
          comparable homes.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink to="/properties" withArrow>
            Browse Properties
          </ButtonLink>
          <ButtonLink to="/contact" variant="outline">
            Contact an Advisor
          </ButtonLink>
        </div>
      </div>
    );
  }

  const saved = isFavorite(property.slug);
  const similar = (properties ?? [])
    .filter(
      (item) =>
        item.slug !== property.slug && (item.city === property.city || item.type === property.type),
    )
    .slice(0, 3);

  const specifications = [
    { icon: BedDouble, label: 'Bedrooms', value: String(property.beds) },
    { icon: Bath, label: 'Bathrooms', value: String(property.baths) },
    { icon: Maximize, label: 'Interior', value: `${formatNumber(property.sqft)} sq ft` },
    { icon: CalendarDays, label: 'Built', value: String(property.year) },
  ];

  return (
    <>
      <div className="shell pb-16 pt-[calc(var(--header-height)+24px)] sm:pb-20">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.16em] text-muted">
          <Link to="/" className="transition-colors hover:text-navy">
            Home
          </Link>
          <ChevronRight aria-hidden="true" className="h-3 w-3" strokeWidth={1.8} />
          <Link to="/properties" className="transition-colors hover:text-navy">
            Properties
          </Link>
          <ChevronRight aria-hidden="true" className="h-3 w-3" strokeWidth={1.8} />
          <span aria-current="page" className="normal-case tracking-normal text-navy">
            {property.name}
          </span>
        </nav>

        <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="label">{property.type} · {property.status}</p>
            <h1 className="mt-3 text-[clamp(2rem,4.4vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.028em] text-navy">
              {property.name}
            </h1>
            <p className="mt-3 flex items-center gap-1.5 text-[14px] text-muted">
              <MapPin aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />
              {property.location}
            </p>
          </div>
          <p className="text-[19px] font-semibold text-navy sm:text-[22px]">
            {formatPriceShort(property.price)}
          </p>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="min-w-0 lg:col-span-8">
            <PropertyGallery images={property.images} name={property.name} />

            <div className="mt-12">
              <h2 className="text-[24px] font-semibold tracking-[-0.02em] text-navy sm:text-[28px]">
                About this property
              </h2>
              <p className="mt-4 text-[16px] font-medium leading-relaxed text-navy/80">
                {property.tagline}
              </p>
              {property.description.map((paragraph) => (
                <p key={paragraph} className="body-copy mt-4">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-11 border-t border-line pt-9">
              <h2 className="text-[11px] font-semibold uppercase tracking-label text-champagne">
                Key features
              </h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {property.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-[14.5px] text-navy/85">
                    <Check
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-champagne-deep"
                      strokeWidth={2}
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 border-t border-line pt-9">
              <h2 className="text-[11px] font-semibold uppercase tracking-label text-champagne">
                Amenities
              </h2>
              <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3.5 sm:grid-cols-3">
                {property.amenities.map((amenity) => (
                  <li key={amenity} className="flex items-start gap-2.5 text-[13.5px] text-muted">
                    <Sparkles
                      aria-hidden="true"
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-champagne/80"
                      strokeWidth={1.6}
                    />
                    {amenity}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 grid gap-4 border-t border-line pt-9 sm:grid-cols-3">
              {specifications.map((spec) => (
                <div key={spec.label} className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ivory text-navy">
                    <spec.icon aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                  <span>
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                      {spec.label}
                    </span>
                    <span className="mt-0.5 block text-[14px] font-medium text-navy">
                      {spec.value}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="rounded-card border border-line bg-white p-5 sm:p-6 lg:sticky lg:top-[calc(var(--header-height)+24px)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-champagne-deep">
                Asking price
              </p>
              <p className="mt-2 text-[30px] font-semibold leading-none tracking-[-0.03em] text-navy">
                {formatPriceFull(property.price)}
              </p>
              <p className="mt-2 text-[12.5px] text-muted">
                {property.type} · {formatNumber(property.sqft)} sq ft
                {property.lot ? ` · ${property.lot}` : ''}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-y-4 border-y border-line py-5">
                {specifications.map((spec) => (
                  <div key={spec.label}>
                    <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                      <spec.icon aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.6} />
                      {spec.label}
                    </p>
                    <p className="mt-1.5 text-[14.5px] font-medium text-navy">{spec.value}</p>
                  </div>
                ))}
              </div>

              {property.agent ? (
                <div className="mt-6 flex items-center gap-3.5">
                  <img
                    src={imageUrl(property.agent.image)}
                    alt={`Portrait of ${property.agent.name}`}
                    width={52}
                    height={52}
                    loading="lazy"
                    className="rounded-full object-cover"
                    style={{ height: 52, width: 52 }}
                  />
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                      Listed by
                    </p>
                    <p className="mt-0.5 truncate text-[15px] font-medium text-navy">
                      {property.agent.name}
                    </p>
                    <a
                      href={formatPhoneHref(property.agent.phone)}
                      className="mt-0.5 inline-flex items-center gap-1.5 text-[12.5px] text-muted transition-colors hover:text-navy"
                    >
                      <Phone aria-hidden="true" className="h-3 w-3" strokeWidth={1.7} />
                      {property.agent.phone}
                    </a>
                  </div>
                </div>
              ) : null}

              <div className="mt-6 space-y-2.5">
                <Button className="w-full" onClick={() => setDialog('agent')} withArrow>
                  Contact Agent
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setDialog('viewing')}>
                  Schedule a Viewing
                </Button>
                <button
                  type="button"
                  onClick={() => toggleFavorite(property.slug)}
                  aria-pressed={saved}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[3px] text-[11px] font-semibold uppercase tracking-[0.15em] text-muted transition-colors duration-300 hover:text-navy"
                >
                  <Heart
                    aria-hidden="true"
                    className={`h-4 w-4 ${saved ? 'fill-champagne text-champagne' : ''}`}
                    strokeWidth={1.7}
                  />
                  {saved ? 'Saved to your properties' : 'Save this property'}
                </button>
              </div>
            </div>
          </aside>
        </div>

        {similar.length > 0 ? (
          <section aria-labelledby="similar-heading" className="mt-16 border-t border-line pt-12 sm:mt-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <SectionLabel>Continue exploring</SectionLabel>
                <h2 id="similar-heading" className="display-sm mt-3">
                  Similar properties
                </h2>
              </div>
              <Link
                to="/properties"
                className="inline-flex min-h-11 items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-navy transition-colors hover:text-champagne-deep"
              >
                <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.8} />
                All properties
              </Link>
            </div>

            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {similar.map((item) => (
                <li key={item.id}>
                  <PropertyCard property={item} sizes="(min-width: 1024px) 31vw, (min-width: 640px) 47vw, 92vw" />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
              Asking price
            </p>
            <p className="truncate text-[17px] font-semibold text-navy">
              {formatPriceShort(property.price)}
            </p>
          </div>
          <Button size="sm" onClick={() => setDialog('agent')} className="shrink-0">
            Contact Agent
          </Button>
        </div>
      </div>

      <div className="h-20 lg:hidden" aria-hidden="true" />

      <InquiryDialog
        open={dialog === 'agent'}
        onClose={() => setDialog(null)}
        kind="agent"
        property={property}
        title={`Ask about ${property.name}`}
      />
      <InquiryDialog
        open={dialog === 'viewing'}
        onClose={() => setDialog(null)}
        kind="viewing"
        property={property}
        title={`View ${property.name} in person`}
      />
    </>
  );
}
