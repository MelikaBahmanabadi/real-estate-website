import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, Phone, X } from 'lucide-react';
import { navItems, site } from '../../data/site';
import { useLockBodyScroll, useScrolled } from '../../hooks';
import { formatPhoneHref } from '../../lib/format';
import { Logo } from '../ui/Logo';

export function Header() {
  const location = useLocation();
  const scrolled = useScrolled(12);
  const [menuOpen, setMenuOpen] = useState(false);
  const overlay = location.pathname === '/' && !scrolled && !menuOpen;

  useLockBodyScroll(menuOpen);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const query = window.matchMedia('(min-width: 1024px)');
    const onChange = () => {
      if (query.matches) setMenuOpen(false);
    };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, [menuOpen]);

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  const headerTone = overlay
    ? 'bg-transparent text-white'
    : menuOpen
      ? 'bg-navy text-white'
      : 'border-b border-line/80 bg-ivory/95 text-navy backdrop-blur-md';

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,color,box-shadow] duration-500 ease-editorial ${headerTone}`}
    >
      <div className="shell flex h-[var(--header-height)] items-center justify-between gap-6">
        <Logo tone={overlay || menuOpen ? 'light' : 'dark'} className="relative z-10" />

        <nav aria-label="Primary" className="absolute left-1/2 hidden -translate-x-1/2 lg:block">
          <ul className="flex items-center gap-7 xl:gap-9">
            {navItems.map((item) => {
              const active = isActive(item.to);
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    aria-current={active ? 'page' : undefined}
                    data-active={active}
                    className={`link-underline inline-flex min-h-11 items-center text-[11.5px] font-medium uppercase tracking-[0.18em] transition-colors duration-300 ${
                      overlay
                        ? active
                          ? 'text-champagne'
                          : 'text-white/85 hover:text-white'
                        : active
                          ? 'text-champagne-deep'
                          : 'text-navy/75 hover:text-navy'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="relative z-10 flex items-center gap-2 sm:gap-3">
          <a
            href={formatPhoneHref(site.phone)}
            className={`group/phone hidden min-h-11 items-center gap-2.5 rounded-full border px-5 text-[12px] font-medium tracking-[0.06em] transition-colors duration-300 md:inline-flex ${
              overlay
                ? 'border-white/35 text-white hover:border-white hover:bg-white hover:text-navy'
                : menuOpen
                  ? 'border-white/35 text-white hover:border-white hover:bg-white hover:text-navy'
                  : 'border-navy/20 text-navy hover:border-navy hover:bg-navy hover:text-white'
            }`}
          >
            <Phone aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.7} />
            <span className="tabular-nums">{site.phone}</span>
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-300 lg:hidden ${
              overlay || menuOpen
                ? 'border-white/30 text-white hover:bg-white/10'
                : 'border-navy/20 text-navy hover:bg-navy hover:text-white'
            }`}
          >
            {menuOpen ? (
              <X aria-hidden="true" className="h-5 w-5" strokeWidth={1.6} />
            ) : (
              <Menu aria-hidden="true" className="h-5 w-5" strokeWidth={1.6} />
            )}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="lg:hidden"
      >
        <div className="h-[calc(100svh-var(--header-height))] overflow-y-auto border-t border-white/10 bg-navy text-white">
          <nav aria-label="Mobile" className="shell py-4">
            <ul className="divide-y divide-white/10">
              {navItems.map((item, index) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    aria-current={isActive(item.to) ? 'page' : undefined}
                    className="flex min-h-[58px] items-center justify-between gap-4 py-3 text-[19px] font-medium tracking-[-0.01em] transition-colors duration-300 hover:text-champagne"
                    style={{ animationDelay: `${80 + index * 40}ms` }}
                  >
                    <span className={isActive(item.to) ? 'text-champagne' : undefined}>
                      {item.label}
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-4 w-4 text-white/35"
                      strokeWidth={1.5}
                    />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 pb-8 text-sm text-white/70">
              <a
                href={formatPhoneHref(site.phone)}
                className="inline-flex min-h-11 items-center gap-3 transition-colors hover:text-white"
              >
                <Phone aria-hidden="true" className="h-4 w-4 text-champagne" strokeWidth={1.6} />
                {site.phone}
              </a>
              <a
                href={`mailto:${site.email}`}
                className="inline-flex min-h-11 items-center gap-3 transition-colors hover:text-white"
              >
                <span aria-hidden="true" className="text-champagne">
                  @
                </span>
                {site.email}
              </a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
