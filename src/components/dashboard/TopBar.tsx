'use client';

import { motion } from 'framer-motion';

const TABS = ['Overview', 'Datasets', 'Models', 'Insights', 'Automations'];

export function TopBar() {
  return (
    <div className="flex h-14 items-center justify-between border-b border-border bg-bg-elev1 px-6">
      <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-fg-muted">
        <span>workspace</span>
        <span className="text-fg-dim">/</span>
        <span>prod-eu</span>
        <span className="text-fg-dim">/</span>
        <span className="text-fg">insights</span>
      </div>

      <div className="hidden items-center gap-3 md:flex">
        <div className="flex items-center gap-2 rounded-sm border border-border bg-bg-elev2 px-3 py-1.5 text-xs text-fg-muted">
          <span className="font-mono text-fg-dim">⌘K</span>
          <span>Search…</span>
        </div>
        <div className="flex items-center gap-2 rounded-sm border border-border bg-bg-elev2 px-2.5 py-1.5">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-fg text-[10px] font-medium text-bg-base">
            R
          </span>
          <span className="text-xs text-fg">ridwan</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-dim">
            admin
          </span>
        </div>
      </div>
    </div>
  );
}