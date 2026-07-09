'use client';

import { motion } from 'framer-motion';

export function StepVisual({ kind }: { kind: 'ring' | 'node' | 'bar' }) {
  if (kind === 'ring') {
    return (
      <div className="relative h-12 w-12">
        <motion.div
          className="absolute inset-0 rounded-full border border-border-hi"
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-1 rounded-full border border-fg-dim"
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-[42%] rounded-full bg-fg" />
      </div>
    );
  }
  if (kind === 'node') {
    return (
      <div className="relative h-12 w-12">
        <svg viewBox="0 0 48 48" className="h-full w-full">
          <line x1="24" y1="6" x2="8" y2="42" stroke="rgba(255,255,255,0.12)" />
          <line x1="24" y1="6" x2="40" y2="42" stroke="rgba(255,255,255,0.12)" />
          <line x1="8" y1="42" x2="40" y2="42" stroke="rgba(255,255,255,0.12)" />
          <circle cx="24" cy="6" r="3" fill="#fafafa" />
          <circle cx="8" cy="42" r="2" fill="rgba(250,250,250,0.6)" />
          <circle cx="40" cy="42" r="2" fill="rgba(250,250,250,0.6)" />
          <motion.circle
            r="1.5"
            fill="#fafafa"
            animate={{
              cx: [24, 8, 40, 24],
              cy: [6, 42, 42, 6],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
      </div>
    );
  }
  // bar
  return (
    <div className="flex h-12 w-12 items-end justify-between gap-1.5">
      {[0.4, 0.7, 0.55, 0.9, 0.65].map((h, i) => (
        <motion.div
          key={i}
          className="w-1.5 origin-bottom bg-fg"
          initial={{ scaleY: h * 0.4 }}
          animate={{ scaleY: [h * 0.4, h, h * 0.6, h * 0.9, h * 0.4] }}
          transition={{
            duration: 2.6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.15,
          }}
          style={{ height: '100%' }}
        />
      ))}
    </div>
  );
}