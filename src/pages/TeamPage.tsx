import { PageMasthead } from '../components/ui/PageMasthead';
import { TeamSection } from '../components/sections/TeamSection';
import { CtaSection } from '../components/sections/CtaSection';
import { usePageTitle } from '../hooks';

export default function TeamPage() {
  usePageTitle('Team');

  return (
    <>
      <PageMasthead
        label="Our Team"
        title="People, not a portal."
        intro="Four advisors, each with a defined discipline. You will work directly with the person whose expertise matches your search — never a call centre."
      />
      <TeamSection showCta={false} />
      <CtaSection />
    </>
  );
}
