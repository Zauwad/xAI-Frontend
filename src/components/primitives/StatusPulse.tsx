'use client';

import { motion } from 'framer-motion';

type Props = {
  className?: string;
  size?: 'sm' | 'md';
  label?: string;
  variant?: 'solid' | 'subtle';
  labelClassName?: string;
};

const SIZES = {
  sm: { dot: 'h-1.5 w-1.5', ring: 2.6, duration: 1.8 },
  md: { dot: 'h-2 w-2', ring: 2.4, duration: 2 },
};

export function StatusPulse({
  className = '',
  size = 'sm',
  label,
  variant = 'solid',
  labelClassName = '',
}: Props) {
  const s = SIZES[size];
  const baseOpacity = variant === 'subtle' ? 0.4 : 0.6;
  return (
    <span
      className={`inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] ${className}`}
    >
      <span className="relative grid place-items-center">
        <span className={`absolute rounded-full bg-fg ${s.dot}`} />
        <motion.span
          className={`absolute rounded-full bg-fg/60 ${s.dot}`}
          animate={{ scale: [1, s.ring, 1], opacity: [baseOpacity, 0, baseOpacity] }}
          transition={{ duration: s.duration, repeat: Infinity, ease: 'easeOut' }}
        />
      </span>
      {label && <span className={labelClassName}>{label}</span>}
    </span>
  );
}