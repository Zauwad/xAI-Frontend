'use client';

import { motion } from 'framer-motion';
import { TABLE_ROWS } from '@/lib/mockData';

const STATUS_COLOR: Record<string, string> = {
  Live: 'bg-fg',
  Syncing: 'bg-fg-muted',
  Paused: 'bg-fg-dim',
};

export function DataTable() {
  return (
    <div className="overflow-hidden border border-border bg-bg-elev1">
      <div className="grid grid-cols-[1.4fr_1fr_1fr_0.8fr_0.8fr] gap-4 border-b border-border bg-bg-elev2 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim">
        <span>Dataset</span>
        <span>Source</span>
        <span>Kind</span>
        <span className="text-right">Records</span>
        <span className="text-right">Updated</span>
      </div>
      <div>
        {TABLE_ROWS.map((row, i) => (
          <motion.div
            key={row.id}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-5% 0px' }}
            transition={{ duration: 0.5, delay: i * 0.04 }}
            className="group grid grid-cols-[1.4fr_1fr_1fr_0.8fr_0.8fr] items-center gap-4 border-b border-border px-5 py-3 text-sm transition-colors duration-300 last:border-b-0 hover:bg-bg-elev2"
          >
            <span className="flex items-center gap-3 font-mono text-xs tabular text-fg">
              <span
                className={`h-1.5 w-1.5 rounded-full ${STATUS_COLOR[row.status]}`}
              />
              {row.id}
            </span>
            <span className="text-fg-muted">{row.source}</span>
            <span className="text-fg-muted">{row.kind}</span>
            <span className="text-right tabular text-fg">
              {row.count.toLocaleString()}
            </span>
            <span className="text-right font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim group-hover:text-fg-muted">
              {row.updated}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}