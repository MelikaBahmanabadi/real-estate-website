import { useState } from 'react';
import type { FormEvent } from 'react';
import { Check } from 'lucide-react';
import { submitInquiry } from '../../lib/api';
import { Button } from '../ui/Button';

interface InquiryFormProps {
  kind: 'agent' | 'viewing' | 'contact';
  propertySlug?: string;
  propertyName?: string;
  onSent?: () => void;
}

const inputClass =
  'h-12 w-full rounded-[2px] border border-line bg-white px-3.5 text-[14px] text-navy placeholder:text-muted/60 transition-colors duration-300 hover:border-navy/30 focus:border-navy focus:outline-none';

const labelClass = 'mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted';

const copy = {
  agent: {
    title: 'Contact the advisor',
    note: 'Your message goes directly to the advisor responsible for this property.',
    cta: 'Send message',
  },
  viewing: {
    title: 'Schedule a viewing',
    note: 'Private viewings are arranged around your schedule, seven days a week.',
    cta: 'Request viewing',
  },
  contact: {
    title: 'Send an enquiry',
    note: 'Tell us what you are looking for and an advisor will respond within one business day.',
    cta: 'Send enquiry',
  },
} as const;

export function InquiryForm({ kind, propertySlug, propertyName, onSent }: InquiryFormProps) {
  const defaultMessage = propertyName
    ? kind === 'viewing'
      ? `I would like to arrange a private viewing of ${propertyName}.`
      : `I would like more information about ${propertyName}.`
    : '';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState(defaultMessage);
  const [date, setDate] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const today = new Date().toISOString().slice(0, 10);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (message.trim().length < 5) {
      setStatus('error');
      setError('Please add a short message so we can help.');
      return;
    }

    setStatus('submitting');
    setError('');

    try {
      await submitInquiry({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim(),
        propertySlug: propertySlug ?? null,
        kind,
        preferredDate: kind === 'viewing' && date ? date : null,
      });
      setStatus('success');
      onSent?.();
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'We could not send your message.');
    }
  }

  if (status === 'success') {
    return (
      <div className="py-6 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ivory-deep text-champagne-deep">
          <Check aria-hidden="true" className="h-6 w-6" strokeWidth={1.6} />
        </span>
        <h3 className="mt-5 text-[22px] font-semibold text-navy">
          Thank you{name ? `, ${name.split(' ')[0]}` : ''}.
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-[14.5px] leading-relaxed text-muted">
          {'Your request has been sent. An advisor will be in touch within one business day.'}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-6"
          onClick={() => {
            setStatus('idle');
            setName('');
            setEmail('');
            setPhone('');
            setDate('');
            setMessage(defaultMessage);
          }}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${kind}-name`} className={labelClass}>
              Full name
            </label>
            <input
              id={`${kind}-name`}
              name="name"
              autoComplete="name"
              required
              minLength={2}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Alex Rivera"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor={`${kind}-email`} className={labelClass}>
              Email
            </label>
            <input
              id={`${kind}-email`}
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${kind}-phone`} className={labelClass}>
              Phone <span className="font-normal normal-case tracking-normal">(optional)</span>
            </label>
            <input
              id={`${kind}-phone`}
              name="phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="(555) 000-0000"
              className={inputClass}
            />
          </div>
          {kind === 'viewing' ? (
            <div>
              <label htmlFor={`${kind}-date`} className={labelClass}>
                Preferred date
              </label>
              <input
                id={`${kind}-date`}
                name="preferredDate"
                type="date"
                min={today}
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className={inputClass}
              />
            </div>
          ) : null}
        </div>

        <div>
          <label htmlFor={`${kind}-message`} className={labelClass}>
            Message
          </label>
          <textarea
            id={`${kind}-message`}
            name="message"
            required
            minLength={5}
            rows={4}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Tell us what you are looking for…"
            className="w-full resize-y rounded-[2px] border border-line bg-white px-3.5 py-3 text-[14px] leading-relaxed text-navy placeholder:text-muted/60 transition-colors duration-300 hover:border-navy/30 focus:border-navy focus:outline-none"
          />
        </div>
      </div>

      <p aria-live="polite" className="mt-3 min-h-5 text-[12.5px] text-red-600">
        {status === 'error' ? error : ''}
      </p>

      <Button type="submit" disabled={status === 'submitting'} className="w-full" withArrow>
        {status === 'submitting' ? 'Sending…' : copy[kind].cta}
      </Button>

      <p className="mt-4 text-[11.5px] leading-relaxed text-muted/80">{copy[kind].note}</p>
    </form>
  );
}

export const inquiryCopy = copy;
