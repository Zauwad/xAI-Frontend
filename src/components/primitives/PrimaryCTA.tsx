'use client';

import { ReactNode } from 'react';
import { MagneticButton } from './MagneticButton';

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'solid' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
};

const SIZES = {
  sm: 'px-3 py-1.5',
  md: 'px-6 py-3',
};

export function PrimaryCTA({
  children,
  href,
  onClick,
  variant = 'solid',
  size = 'md',
  className = '',
}: Props) {
  const border = variant === 'solid' ? 'border-fg' : 'border-border-hi';
  return (
    <MagneticButton
      href={href}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-sm border ${border} ${SIZES[size]} font-mono text-xs uppercase tracking-[0.22em] ${className}`}
    >
      <span className="relative z-10 transition-colors duration-500 group-hover:text-bg-base">
        {children}
      </span>
      <span className="absolute inset-0 translate-y-full bg-fg transition-transform duration-500 ease-out-quart group-hover:translate-y-0" />
    </MagneticButton>
  );
}