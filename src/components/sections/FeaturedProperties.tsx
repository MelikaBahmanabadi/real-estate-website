import { SectionLabel } from '../ui/SectionLabel';
import { ButtonLink } from '../ui/Button';
import { Reveal } from '../ui/Reveal';
import { PropertyCarousel } from '../property/PropertyCarousel';
import { useProperties } from '../../hooks/useProperties';

function CarouselSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden sm:gap-5 lg:gap-6" aria-hidden="true">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="aspect-[4/5] w-[80%] flex-none animate-pulse rounded-card bg-white sm:w-[46%] lg:w-[27%] xl:w-[24.5%]"
        />
      ))}
    </div>
  );
}

export function FeaturedProperties() {
  const { properties, loading, error } = useProperties();
  const featured = (properties ?? []).filter((property) => property.featured).slice(0, 6);

  return (
    <section aria-labelledby="featured-heading" className="section bg-ivory">
      <div className="shell">
        <Reveal className="text-center">
          <SectionLabel centered>Featured</SectionLabel>
          <h2 id="featured-heading" className="display mt-5">
            Featured Properties
          </h2>
          <p className="body-copy mx-auto mt-4 max-w-lg text-[15.5px]">
            A considered selection from our current register, updated as homes come quietly to
            market.
          </p>
        </Reveal>

        <div className="mt-10 lg:mt-14">
          {loading ? <CarouselSkeleton /> : null}

          {error && !loading ? (
            <div className="rounded-card border border-line bg-white px-6 py-12 text-center">
              <p className="text-[15px] text-muted">{error}</p>
              <ButtonLink to="/properties" variant="outline" className="mt-6" withArrow>
                Browse Properties
              </ButtonLink>
            </div>
          ) : null}

          {!loading && !error ? <PropertyCarousel properties={featured} /> : null}
        </div>

        <div className="mt-10 flex justify-center lg:mt-14">
          <ButtonLink to="/properties" variant="outline" withArrow>
            View All Properties
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
