'use client';

import { motion } from 'framer-motion';
import { ACTIVITY } from '@/lib/mockData';

const ICONS: Record<string, string> = {
  insight: '◆',
  automation: '◈',
  sync: '◇',
};

export function ActivityFeed() {
  return (
    <div className="border border-border bg-bg-elev1">
      <div className="flex items-center justify-between border-b border-border bg-bg-elev2 px-5 py-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim">
          Activity
        </span>
        <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-muted">
          <span className="relative grid h-1.5 w-1.5 place-items-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-fg/60" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-fg" />
          </span>
          live
        </span>
      </div>
      <ul className="divide-y divide-[var(--border)]">
        {ACTIVITY.map((item, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-5% 0px' }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="flex items-start gap-4 px-5 py-4 transition-colors duration-300 hover:bg-bg-elev2"
          >
            <span
              className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-border bg-bg-elev2 font-mono text-xs ${
                item.live ? 'text-fg' : 'text-fg-muted'
              }`}
            >
              {ICONS[item.kind]}
            </span>
            <div className="flex-1">
              <p className="text-sm text-fg">{item.title}</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim">
                {item.actor} · {item.time}
              </p>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}