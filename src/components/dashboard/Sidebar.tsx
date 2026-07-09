'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const NAV = [
  { icon: '◐', label: 'Overview', active: false },
  { icon: '◆', label: 'Datasets', active: false },
  { icon: '◇', label: 'Models', active: false },
  { icon: '✦', label: 'Insights', active: true },
  { icon: '◈', label: 'Automations', active: false },
  { icon: '⊡', label: 'Settings', active: false },
];

export function Sidebar() {
  return (
    <aside className="hidden w-[240px] shrink-0 flex-col border-r border-border bg-bg-elev1 md:flex">
      <div className="flex h-14 items-center gap-2 border-b border-border px-5">
        <span className="grid h-6 w-6 place-items-center rounded-sm border border-border-hi bg-bg-elev2 text-[10px]">
          ✕
        </span>
        <span className="font-mono text-sm">xai</span>
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim">
          /workspace
        </span>
      </div>

      <div className="px-3 py-4">
        <div className="px-2 pb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-fg-dim">
          workspace
        </div>
        <nav className="flex flex-col gap-0.5">
          {NAV.map((item) => (
            <SidebarItem key={item.label} {...item} />
          ))}
        </nav>
      </div>

      <div className="mt-auto border-t border-border px-5 py-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-dim">
          region
        </div>
        <div className="mt-1 flex items-center gap-2 text-xs text-fg-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-fg" />
          us-east-1
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({
  icon,
  label,
  active,
}: {
  icon: string;
  label: string;
  active: boolean;
}) {
  return (
    <motion.button
      whileHover={{ x: 2 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative flex items-center gap-3 rounded-sm px-3 py-2 text-left text-sm transition-colors duration-300 ${
        active
          ? 'bg-bg-elev2 text-fg'
          : 'text-fg-muted hover:bg-bg-elev2 hover:text-fg'
      }`}
    >
      <span
        className={`absolute left-0 top-1/2 h-4 w-px -translate-y-1/2 transition-colors duration-300 ${
          active ? 'bg-fg' : 'bg-transparent group-hover:bg-border-hi'
        }`}
      />
      <span className="font-mono text-xs">{icon}</span>
      <span>{label}</span>
    </motion.button>
  );
}