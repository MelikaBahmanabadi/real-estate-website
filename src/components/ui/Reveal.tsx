import type { ReactNode } from 'react';
import { useReveal } from '../../hooks';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/** Gentle fade-up the first time a block enters the viewport. */
export function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      data-visible={visible ? 'true' : 'false'}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
