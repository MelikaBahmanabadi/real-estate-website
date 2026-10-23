import type { ReactNode } from 'react';
import { SectionLabel } from '../ui/SectionLabel';

interface PageMastheadProps {
  label: string;
  title: string;
  intro?: string;
  children?: ReactNode;
}

/** Shared editorial page header. Sits below the fixed site header. */
export function PageMasthead({ label, title, intro, children }: PageMastheadProps) {
  return (
    <section className="border-b border-line/70 bg-ivory">
      <div className="shell pb-12 pt-[calc(var(--header-height)+56px)] sm:pb-14 sm:pt-[calc(var(--header-height)+72px)]">
        <SectionLabel>{label}</SectionLabel>
        <div className="mt-5 grid gap-6 lg:grid-cols-12 lg:items-end">
          <h1 className="display text-[clamp(2.1rem,5vw,4rem)] lg:col-span-7">{title}</h1>
          {intro ? (
            <p className="body-copy max-w-xl text-[15.5px] lg:col-span-5">{intro}</p>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}
