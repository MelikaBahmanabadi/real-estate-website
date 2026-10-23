import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import type { Property } from '../../types';
import { formatPriceShort } from '../../lib/format';
import { CARD_IMAGE_WIDTHS, imageSrcSet, imageUrl } from '../../lib/images';
import { FavoriteButton } from './FavoriteButton';

interface PropertyCardProps {
  property: Property;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

export function PropertyCard({
  property,
  sizes = '(min-width: 1024px) 25vw, (min-width: 640px) 46vw, 80vw',
  priority = false,
  className = '',
}: PropertyCardProps) {
  const { name, location, price, type, beds, baths, images, slug } = property;
  const cover = images[0];

  return (
    <article className={`group relative h-full ${className}`}>
      <Link
        to={`/properties/${slug}`}
        aria-label={`View details for ${name} in ${location}, priced at ${formatPriceShort(price)}`}
        className="block h-full rounded-card transition-shadow duration-500 ease-editorial focus-visible:outline-offset-4 group-hover:shadow-[0_36px_70px_-46px_rgba(10,18,42,0.6)]"
      >
        <div className="media media-zoom aspect-[4/5] outline outline-1 -outline-offset-1 outline-black/5 transition-all duration-500 group-hover:outline-champagne/60">
          <img
            src={imageUrl(cover, 900)}
            srcSet={imageSrcSet(cover, CARD_IMAGE_WIDTHS)}
            sizes={sizes}
            alt={`${name} — ${location}`}
            width={900}
            height={1125}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
          />

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-navy via-navy/35 to-transparent opacity-[0.92]"
          />

          <span className="absolute left-4 top-4 rounded-[2px] border border-white/25 bg-white/10 px-2.5 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-white/95 backdrop-blur-sm">
            {type}
          </span>

          <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
            <h3 className="text-[18px] font-medium leading-snug tracking-[-0.01em] text-white sm:text-[19px]">
              {name}
            </h3>
            <p className="mt-2 flex items-center gap-1.5 text-[12.5px] text-white/75">
              <MapPin aria-hidden="true" className="h-3.5 w-3.5 shrink-0" strokeWidth={1.6} />
              {location}
            </p>
            <div className="mt-4 flex items-end justify-between gap-3 border-t border-white/15 pt-3.5">
              <p className="text-[14.5px] font-semibold tracking-[0.01em] text-white">
                {formatPriceShort(price)}
              </p>
              <p className="text-[10.5px] uppercase tracking-[0.16em] text-white/60">
                {beds} bd · {baths} ba
              </p>
            </div>
          </div>
        </div>
      </Link>

      <FavoriteButton
        slug={slug}
        name={name}
        className="absolute right-4 top-4 z-10"
      />
    </article>
  );
}
