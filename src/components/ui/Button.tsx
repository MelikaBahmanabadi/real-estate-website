import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { LinkProps } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

type Variant = 'solid' | 'outline' | 'light' | 'ghost';
type Size = 'md' | 'sm';

const variants: Record<Variant, string> = {
  solid:
    'bg-navy text-white border border-navy hover:bg-navy-soft hover:border-navy-soft',
  outline:
    'bg-transparent text-navy border border-navy/25 hover:border-navy hover:bg-navy hover:text-white',
  light:
    'bg-transparent text-white border border-white/45 hover:bg-white hover:text-navy hover:border-white',
  ghost: 'bg-transparent text-navy border border-transparent hover:text-champagne px-0',
};

const sizes: Record<Size, string> = {
  md: 'min-h-12 px-7 text-[11.5px]',
  sm: 'min-h-10 px-5 text-[11px]',
};

const base =
  'group/btn inline-flex items-center justify-center gap-2.5 rounded-[3px] font-semibold uppercase tracking-[0.15em] transition-colors duration-300 ease-editorial disabled:cursor-not-allowed disabled:opacity-60';

export function buttonStyles(variant: Variant = 'solid', size: Size = 'md', className = '') {
  return `${base} ${variants[variant]} ${variant === 'ghost' ? 'min-h-11' : sizes[size]} ${className}`;
}

function Arrow() {
  return (
    <ArrowRight
      aria-hidden="true"
      className="h-4 w-4 shrink-0 transition-transform duration-500 ease-editorial group-hover/btn:translate-x-1"
      strokeWidth={1.6}
    />
  );
}

interface CommonProps {
  variant?: Variant;
  size?: Size;
  withArrow?: boolean;
  children: ReactNode;
  className?: string;
}

export function Button({
  variant,
  size,
  withArrow,
  children,
  className,
  ...rest
}: CommonProps & ComponentPropsWithoutRef<'button'>) {
  return (
    <button className={buttonStyles(variant, size, className)} {...rest}>
      <span>{children}</span>
      {withArrow ? <Arrow /> : null}
    </button>
  );
}

export function ButtonLink({
  variant,
  size,
  withArrow,
  children,
  className,
  ...rest
}: CommonProps & LinkProps) {
  return (
    <Link className={buttonStyles(variant, size, className)} {...rest}>
      <span>{children}</span>
      {withArrow ? <Arrow /> : null}
    </Link>
  );
}

export function ButtonAnchor({
  variant,
  size,
  withArrow,
  children,
  className,
  ...rest
}: CommonProps & ComponentPropsWithoutRef<'a'>) {
  return (
    <a className={buttonStyles(variant, size, className)} {...rest}>
      <span>{children}</span>
      {withArrow ? <Arrow /> : null}
    </a>
  );
}
