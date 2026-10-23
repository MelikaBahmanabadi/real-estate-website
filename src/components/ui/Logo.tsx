import { Link } from 'react-router-dom';

interface LogoProps {
  tone?: 'light' | 'dark';
  className?: string;
}

export function Logo({ tone = 'dark', className = '' }: LogoProps) {
  const text = tone === 'light' ? 'text-white' : 'text-navy';

  return (
    <Link
      to="/"
      aria-label="Horizon Properties — home"
      className={`group inline-flex items-center gap-3 ${className}`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 32 32"
        className="h-8 w-8 shrink-0 text-champagne transition-transform duration-500 ease-editorial group-hover:-translate-y-0.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="square"
      >
        <path d="M3.5 28V12.2L16 4.5l12.5 7.7V28" />
        <path d="M8.5 28V15.5h5.4V28" />
        <path d="M18.1 28V15.5h5.4V28" />
        <path d="M2 28h28" />
        <path d="M13.9 21.5h4.2" />
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className={`text-[15px] font-semibold uppercase tracking-[0.2em] ${text} sm:text-[16px]`}
        >
          Horizon
        </span>
        <span className="mt-1 text-[8.5px] font-medium uppercase tracking-[0.34em] text-champagne sm:text-[9px]">
          Properties
        </span>
      </span>
    </Link>
  );
}
