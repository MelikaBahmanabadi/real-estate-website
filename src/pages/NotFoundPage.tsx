import { PageMasthead } from '../components/ui/PageMasthead';
import { ButtonLink } from '../components/ui/Button';
import { usePageTitle } from '../hooks';

export default function NotFoundPage() {
  usePageTitle('Page not found');

  return (
    <>
      <PageMasthead label="404" title="This page has moved on." intro="The address you followed does not exist. The portfolio, however, is very much alive." />
      <div className="shell flex flex-col items-start gap-6 py-16 sm:py-20">
        <p className="max-w-md text-[15px] leading-relaxed text-muted">
          Browse our current register of residences, or speak with an advisor about homes that
          never reach the open market.
        </p>
        <div className="flex flex-wrap gap-3">
          <ButtonLink to="/properties" withArrow>
            View Properties
          </ButtonLink>
          <ButtonLink to="/" variant="outline">
            Back Home
          </ButtonLink>
        </div>
      </div>
    </>
  );
}
