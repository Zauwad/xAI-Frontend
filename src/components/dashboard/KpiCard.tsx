'use client';

import { motion } from 'framer-motion';
import { CountUp } from './CountUp';
import { Sparkline } from './Sparkline';

export function KpiCard({
  label,
  value,
  delta,
  trend,
  suffix = '',
  invert = false,
  delay = 0,
}: {
  label: string;
  value: number;
  delta: string;
  trend: number[];
  suffix?: string;
  invert?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      whileHover={{ y: -2 }}
      className="group relative flex flex-col gap-6 border border-border bg-bg-elev1 p-6 transition-colors duration-500 hover:border-border-hi"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-dim">
          {label}
        </span>
        <span className="font-mono text-[11px] tabular text-fg-muted">
          {delta}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-[36px] font-medium leading-none tracking-[-0.03em]">
          <CountUp to={value} suffix={suffix} />
        </span>
      </div>
      <div className="-mb-1 mt-auto h-12">
        <Sparkline data={trend} invert={invert} />
      </div>
    </motion.div>
  );
}