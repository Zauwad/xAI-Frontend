'use client';

import { ReactNode } from 'react';

export function Container({
  children,
  className = '',
  size = 'default',
}: {
  children: ReactNode;
  className?: string;
  size?: 'default' | 'wide' | 'narrow';
}) {
  const widths = {
    narrow: 'max-w-[920px]',
    default: 'max-w-[1200px]',
    wide: 'max-w-[1440px]',
  };
  return (
    <div className={`mx-auto w-full px-6 md:px-10 ${widths[size]} ${className}`}>
      {children}
    </div>
  );
}