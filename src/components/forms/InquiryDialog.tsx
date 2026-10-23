import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useLockBodyScroll } from '../../hooks';
import { formatPriceShort } from '../../lib/format';
import type { Property } from '../../types';
import { InquiryForm } from './InquiryForm';

interface InquiryDialogProps {
  open: boolean;
  onClose: () => void;
  kind: 'agent' | 'viewing';
  property?: Pick<Property, 'slug' | 'name' | 'city' | 'region' | 'price'> | null;
  title: string;
}

export function InquiryDialog({ open, onClose, kind, property, title }: InquiryDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center overflow-y-auto bg-navy-deep/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="inquiry-dialog-title"
        className="relative w-full max-w-xl animate-fade-up rounded-t-[14px] bg-white p-5 shadow-2xl sm:rounded-card sm:p-8"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-navy transition-colors duration-300 hover:border-navy hover:bg-navy hover:text-white"
        >
          <X aria-hidden="true" className="h-4 w-4" strokeWidth={1.7} />
        </button>

        <div className="pr-12">
          <p className="label">{kind === 'viewing' ? 'Private viewing' : 'Enquiry'}</p>
          <h2 id="inquiry-dialog-title" className="mt-3 text-[26px] font-semibold leading-tight text-navy">
            {title}
          </h2>
          {property ? (
            <p className="mt-2 text-[13.5px] text-muted">
              {property.name} · {property.city}, {property.region} ·{' '}
              {formatPriceShort(property.price)}
            </p>
          ) : null}
        </div>

        <div className="mt-6">
          <InquiryForm
            kind={kind}
            propertySlug={property?.slug}
            propertyName={property?.name}
          />
        </div>
      </div>
    </div>
  );
}
