import type { ReactNode } from 'react';

interface SectionLabelProps {
  children: ReactNode;
  centered?: boolean;
  className?: string;
  tone?: 'gold' | 'light';
}

export function SectionLabel({ children, centered = false, className = '', tone = 'gold' }: SectionLabelProps) {
  return (
    <span
      className={`inline-flex items-center gap-3 ${
        centered ? 'justify-center' : ''
      } ${tone === 'light' ? 'text-champagne-soft' : 'text-champagne'} ${className}`}
    >
      <span
        aria-hidden="true"
        className={`h-px w-6 ${tone === 'light' ? 'bg-champagne-soft/70' : 'bg-champagne/80'}`}
      />
      <span className="text-[11px] font-semibold uppercase tracking-label">{children}</span>
      {centered ? (
        <span aria-hidden="true" className="h-px w-6 bg-champagne/80" />
      ) : null}
    </span>
  );
}
