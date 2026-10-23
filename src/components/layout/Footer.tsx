import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { navItems, site } from '../../data/site';
import { formatPhoneHref } from '../../lib/format';
import { subscribeToNewsletter } from '../../lib/api';
import { Logo } from '../ui/Logo';

const socialIcons = {
  Instagram,
  LinkedIn: Linkedin,
  Facebook,
} as const;

const footerLinks = [
  { label: 'Privacy', to: '/contact' },
  { label: 'Terms', to: '/contact' },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    setMessage('');
    try {
      await subscribeToNewsletter(email);
      setStatus('success');
      setMessage('Thank you — you are on the list.');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Subscription failed.');
    }
  }

  return (
    <footer className="bg-navy text-white">
      <div className="shell py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Logo tone="light" />
            <p className="mt-6 max-w-xs text-[14.5px] leading-[1.8] text-white/60">
              A private advisory practice curating architecturally significant homes and considered
              investments across the United States.
            </p>
            <ul className="mt-8 flex items-center gap-2.5">
              {site.socials.map((social) => {
                const Icon = socialIcons[social.label as keyof typeof socialIcons];
                return (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`${site.name} on ${social.label}`}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors duration-300 hover:border-champagne hover:text-champagne"
                    >
                      <Icon aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <nav aria-label="Footer" className="lg:col-span-2">
            <h2 className="text-[11px] font-semibold uppercase tracking-label text-champagne-soft">
              Explore
            </h2>
            <ul className="mt-5 space-y-1">
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="inline-flex min-h-9 items-center text-[14.5px] text-white/65 transition-colors duration-300 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className="text-[11px] font-semibold uppercase tracking-label text-champagne-soft">
              Contact
            </h2>
            <ul className="mt-5 space-y-4 text-[14.5px] text-white/65">
              <li>
                <a
                  href={formatPhoneHref(site.phone)}
                  className="inline-flex items-start gap-3 transition-colors hover:text-white"
                >
                  <Phone aria-hidden="true" className="mt-0.5 h-4 w-4 text-champagne/80" strokeWidth={1.5} />
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-start gap-3 transition-colors hover:text-white"
                >
                  <Mail aria-hidden="true" className="mt-0.5 h-4 w-4 text-champagne/80" strokeWidth={1.5} />
                  {site.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-champagne/80" strokeWidth={1.5} />
                <span>
                  {site.address.line1}
                  <br />
                  {site.address.line2}
                </span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-[11px] font-semibold uppercase tracking-label text-champagne-soft">
              Newsletter
            </h2>
            <p className="mt-5 max-w-xs text-[14.5px] leading-[1.8] text-white/55">
              New listings and market notes, sent quietly once a month.
            </p>
            <form onSubmit={handleSubscribe} className="mt-5">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <div className="flex items-center gap-3 border-b border-white/20 pb-1 transition-colors focus-within:border-champagne">
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Your email address"
                  className="min-h-11 w-full bg-transparent text-[14.5px] text-white placeholder:text-white/35 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  aria-label="Subscribe to the newsletter"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition-colors duration-300 hover:border-champagne hover:text-champagne disabled:opacity-50"
                >
                  <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />
                </button>
              </div>
              <p
                aria-live="polite"
                className={`mt-3 min-h-5 text-[12.5px] ${
                  status === 'error' ? 'text-red-300' : 'text-champagne-soft'
                }`}
              >
                {message}
              </p>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="shell flex flex-col gap-3 py-6 text-[12.5px] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Horizon Properties. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Licensed brokerage · Austin, Texas</span>
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="transition-colors duration-300 hover:text-white/80"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
