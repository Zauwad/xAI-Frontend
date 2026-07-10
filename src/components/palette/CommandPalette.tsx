'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { setPaletteOpen, subscribePalette, togglePalette } from './store';

type Action = {
  id: string;
  label: string;
  hint?: string;
  group: 'Navigate' | 'Insights' | 'Automations' | 'Demo' | 'Help';
  run: () => void;
};

function fuzzyScore(q: string, s: string): number {
  if (!q) return 1;
  const ql = q.toLowerCase();
  const sl = s.toLowerCase();
  let qi = 0;
  let score = 0;
  let streak = 0;
  for (let i = 0; i < sl.length && qi < ql.length; i++) {
    if (sl[i] === ql[qi]) {
      qi++;
      streak++;
      score += 10 + streak * 4;
    } else {
      streak = 0;
    }
  }
  if (qi < ql.length) return -1;
  if (sl.startsWith(ql)) score += 50;
  return score;
}

function navigateTo(id: string) {
  setPaletteOpen(false);
  setTimeout(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 50);
}

const ACTIONS: Action[] = [
  { id: 'hero', label: 'Go to Hero', hint: 'From raw data to decisions', group: 'Navigate', run: () => navigateTo('hero') },
  { id: 'flow', label: 'Go to Process', hint: 'How Xai works', group: 'Navigate', run: () => navigateTo('flow') },
  { id: 'dashboard', label: 'Go to Product', hint: 'The dashboard surface', group: 'Navigate', run: () => navigateTo('dashboard') },
  { id: 'signature', label: 'Go to Signature', hint: 'Cursor-reactive object', group: 'Navigate', run: () => navigateTo('signature') },
  { id: 'top', label: 'Back to top', group: 'Navigate', run: () => navigateTo('top') },
  { id: 'demo-cycle', label: 'Auto-cycle dashboard tabs', hint: 'Demo mode — runs every 6s', group: 'Demo', run: () => window.dispatchEvent(new CustomEvent('xai:demo-cycle')) },
  { id: 'demo-stop', label: 'Stop demo', group: 'Demo', run: () => window.dispatchEvent(new CustomEvent('xai:demo-stop')) },
  { id: 'demo-explode', label: 'Trigger signature explosion', hint: 'Shatter mesh into 12 shards', group: 'Demo', run: () => window.dispatchEvent(new CustomEvent('xai:explode')) },
  { id: 'insight-anomaly', label: 'Insight: EU-west signup drop', hint: 'anomaly · model.detector', group: 'Insights', run: () => navigateTo('dashboard') },
  { id: 'insight-expansion', label: 'Insight: Expansion candidates', hint: 'opportunity · $184k ARR', group: 'Insights', run: () => navigateTo('dashboard') },
  { id: 'auto-revenue', label: 'Automation: Daily revenue digest', hint: 'cron 08:00 UTC → Slack', group: 'Automations', run: () => navigateTo('dashboard') },
  { id: 'auto-churn', label: 'Automation: Churn risk escalation', hint: 'model.score > 0.78 → PagerDuty', group: 'Automations', run: () => navigateTo('dashboard') },
  {
    id: 'shortcuts',
    label: 'Show keyboard shortcuts',
    hint: '⌘K · G H · G P · G S · X to explode',
    group: 'Help',
    run: () => alert('⌘K — palette\nG then H — Hero\nG then P — Product\nG then S — Signature\nX — explode mesh'),
  },
  {
    id: 'about',
    label: 'About this prototype',
    hint: 'stack + decisions',
    group: 'Help',
    run: () =>
      alert(
        'Xai prototype.\nNext 14 · R3F · GSAP · Framer.\nHand-rolled shaders, no chart libs, no UI kits.\nRead README.md for engineering notes.',
      ),
  },
];

const SHORTCUT_TARGETS: Record<string, string> = {
  h: 'hero',
  p: 'dashboard',
  s: 'signature',
  f: 'flow',
  t: 'top',
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Subscribe to the trigger button's open requests.
  useEffect(() => {
    const unsubscribe = subscribePalette(setOpen);
    return () => {
      unsubscribe();
    };
  }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) return ACTIONS.slice(0, 10);
    return ACTIONS
      .map((a) => ({
        a,
        s: Math.max(fuzzyScore(q, a.label), fuzzyScore(q, a.hint ?? '')),
      }))
      .filter((x) => x.s > 0)
      .sort((x, y) => y.s - x.s)
      .slice(0, 10)
      .map((x) => x.a);
  }, [q]);

  // Global keys: ⌘K toggles, / opens, X explodes, G+key navigates.
  useEffect(() => {
    let gArmed = false;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const inField = t?.tagName === 'INPUT' || t?.tagName === 'TEXTAREA';
      const meta = e.metaKey || e.ctrlKey;

      if (meta && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        togglePalette();
        if (!open) setQ('');
        return;
      }
      if (open && e.key === 'Escape') {
        setOpen(false);
        setQ('');
        return;
      }
      if (open) {
        if (e.key === 'ArrowDown') { e.preventDefault(); setIdx((i) => Math.min(filtered.length - 1, i + 1)); return; }
        if (e.key === 'ArrowUp')   { e.preventDefault(); setIdx((i) => Math.max(0, i - 1)); return; }
        if (e.key === 'Enter')     { e.preventDefault(); filtered[idx]?.run(); return; }
      }
      if (inField || open) return;

      if (e.key === '/') {
        e.preventDefault();
        setPaletteOpen(true);
        setQ('');
        return;
      }
      if (e.key === 'x' || e.key === 'X') {
        window.dispatchEvent(new CustomEvent('xai:explode'));
        return;
      }
      if (e.key === 'g' || e.key === 'G') {
        gArmed = true;
        // ponytail: single-shot, decays after a short window — capture-phase next key decides target.
        setTimeout(() => (gArmed = false), 800);
        const next = (ev: KeyboardEvent) => {
          document.removeEventListener('keydown', next, true);
          gArmed = false;
          const target = SHORTCUT_TARGETS[ev.key.toLowerCase()];
          if (target) navigateTo(target);
        };
        document.addEventListener('keydown', next, true);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, filtered, idx]);

  // Focus input on open.
  useEffect(() => {
    if (open) {
      setIdx(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const groups = useMemo(() => {
    const map = new Map<string, Action[]>();
    filtered.forEach((a) => {
      if (!map.has(a.group)) map.set(a.group, []);
      map.get(a.group)!.push(a);
    });
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-bg-base/70 px-4 pt-[14vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[620px] overflow-hidden rounded-md border border-border-hi bg-bg-elev1 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-dim">
                ⌘K
              </span>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setIdx(0);
                }}
                placeholder="Jump anywhere. Search anything."
                className="flex-1 bg-transparent py-4 text-base text-fg placeholder:text-fg-dim focus:outline-none"
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-dim">
                esc
              </span>
            </div>

            <div className="max-h-[58vh] overflow-y-auto">
              {filtered.length === 0 && (
                <div className="px-4 py-10 text-center font-mono text-xs uppercase tracking-[0.18em] text-fg-dim">
                  no commands match
                </div>
              )}
              {groups.map(([group, items]) => (
                <div key={group} className="px-2 py-2">
                  <div className="px-3 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-fg-dim">
                    {group}
                  </div>
                  {items.map((a) => {
                    const flatIndex = filtered.indexOf(a);
                    const active = flatIndex === idx;
                    return (
                      <button
                        key={a.id}
                        onMouseEnter={() => setIdx(flatIndex)}
                        onClick={() => a.run()}
                        className={`flex w-full items-center justify-between gap-3 rounded-sm px-3 py-2.5 text-left text-sm transition-colors duration-150 ${
                          active
                            ? 'bg-bg-elev2 text-fg'
                            : 'text-fg-muted hover:bg-bg-elev2'
                        }`}
                      >
                        <span className="flex flex-col">
                          <span>{a.label}</span>
                          {a.hint && (
                            <span className="font-mono text-[11px] text-fg-dim">
                              {a.hint}
                            </span>
                          )}
                        </span>
                        {active && (
                          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg">
                            ↵
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-border bg-bg-elev2 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-fg-dim">
              <div className="flex items-center gap-3">
                <span>↑↓ navigate</span>
                <span>↵ run</span>
                <span>esc close</span>
              </div>
              <span>xai · workspace</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function PaletteTrigger({ className = '' }: { className?: string }) {
  return (
    <button
      onClick={togglePalette}
      className={`flex items-center gap-2 rounded-sm border border-border bg-bg-elev2 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-muted transition-colors duration-300 hover:border-border-hi hover:text-fg ${className}`}
    >
      <span>search</span>
      <span className="text-fg-dim">⌘K</span>
    </button>
  );
}